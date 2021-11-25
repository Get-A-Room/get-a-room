import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { DateTime } from 'luxon';

import * as admin from './googleAPI/adminAPI';
import * as calendar from './googleAPI/calendarAPI';
import * as responses from '../utils/responses';
import * as schema from '../utils/googleSchema';
import roomData from '../types/roomData';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Middleware that adds all the rooms to the res.locals.rooms
 * @returns
 */
export const addAllRooms = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const client = res.locals.oAuthClient;
        const building = req.query.building as string;

        try {
            let result: schema.CalendarResource[];
            if (building) {
                result = await admin.getRoomData(client, building);
            } else {
                result = await admin.getRoomData(client);
            }

            const rooms = simplifyRoomData(result);

            if (rooms.length === 0) {
                return responses.noContent(req, res);
            }

            res.locals.rooms = rooms;
            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};

/**
 * Middleware that get room availability data and sets it to res.locals.roomReservations
 * Note: This is currently VERY slow!
 * @returns
 */
export const fetchAvailability = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const client = res.locals.oAuthClient;
            const rooms: roomData[] = res.locals.rooms;

            // Create id objects for freebusy query
            const calendarIds = _.map(rooms, (x: roomData) => {
                return { id: x.id };
            });

            let start: string, end: string;

            // TODO: What should happen when the difference between start and end is small
            if (req.query.until) {
                const startDt = DateTime.now().toUTC();
                const endDt = DateTime.fromISO(
                    req.query.until as string
                ).toUTC();
                start = startDt.toISO();
                end = endDt.toISO();

                if (endDt <= startDt) {
                    return responses.badRequest(req, res);
                }
            } else {
                start = DateTime.now().toUTC().toISO();
                end = DateTime.now().toUTC().endOf('day').toISO();
            }

            // Combine all results from freeBusyQuery to this
            const results = {};

            // The query can support maximum of 50 items, so we need to split the rooms into
            // 50 item chunks and run the requests with those chunks.
            for (let i = 0; i < calendarIds.length; i += 50) {
                const result = await calendar.freeBusyQuery(
                    client,
                    _.slice(calendarIds, i, 50 + i),
                    start,
                    end
                );

                _.merge(results, result);
            }

            res.locals.roomReservations = results;
            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};

/**
 * Write reservation data to rooms
 * NOTE: This could probably be included in the previous middleware?
 * @returns
 */
export const writeReservationData = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const rooms: roomData[] = res.locals.rooms;
            const reservations = res.locals.roomReservations;

            _.forEach(rooms, (room: roomData) => {
                room.nextCalendarEvent = reservations[room.id as string];
            });

            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};

/**
 * Remove currently reserved rooms from the results
 * @returns
 */
export const removeReservedRooms = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (req.query.showReserved) {
                next();
            }

            const rooms: roomData[] = res.locals.rooms;
            const currentTimeWithBuffer = DateTime.now()
                .plus({ minutes: 30 })
                .toUTC();

            // Remove from the list if the event is starting in less than 30 minutes or it is ongoing
            // (start time is equal to current time)
            const filteredRooms = _.filter(rooms, (room) => {
                if (
                    room.nextCalendarEvent &&
                    DateTime.fromISO(room.nextCalendarEvent) <=
                        currentTimeWithBuffer
                ) {
                    return false;
                }

                return true;
            });

            res.locals.rooms = filteredRooms;
            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};

/**
 * Simplify results from Google
 * @param result Results from Google API
 * @returns simplified results
 */
export const simplifyRoomData = (
    result: schema.CalendarResource[]
): roomData[] => {
    return result.map((x: schema.CalendarResource) => {
        /**
         * Cleans features of unnecessary information
         * @param features featureInstances
         * @returns array of feature names
         */
        const cleanFeatures = (features: any): string[] => {
            if (!features) {
                return [];
            }

            return features.map((x: any) => x.feature.name);
        };

        return {
            id: x.resourceEmail,
            name: x.resourceName,
            capacity: x.capacity,
            building: x.buildingId,
            floor: x.floorName,
            features: cleanFeatures(x.featureInstances),
            nextCalendarEvent: '-1',
            location: x.generatedResourceName
        };
    });
};

export const simplifySingleRoomData = (
    result: schema.CalendarResource
): roomData => {
    /**
     * Cleans features of unnecessary information
     * @param features featureInstances
     * @returns array of feature names
     */
    const cleanFeatures = (features: any): string[] => {
        if (!features) {
            return [];
        }

        return features.map((x: any) => x.feature.name);
    };

    return {
        id: result.resourceEmail,
        name: result.resourceName,
        capacity: result.capacity,
        building: result.buildingId,
        floor: result.floorName,
        features: cleanFeatures(result.featureInstances),
        nextCalendarEvent: '-1',
        location: result.generatedResourceName
    };
};
