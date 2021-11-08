import express from 'express';
import _ from 'lodash';
import { DateTime } from 'luxon';

import * as admin from './googleAPI/adminAPI';
import * as calendar from './googleAPI/calendarAPI';
import * as responses from '../utils/responses';
import * as schema from '../utils/googleSchema';
import roomData from '../types/roomData';

/**
 * Middleware that adds all the rooms to the res.locals.rooms
 * @returns
 */
export const addAllRooms = () => {
    const middleware = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
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
                return res.status(204).send({
                    code: 204,
                    message: 'No Content'
                });
            }

            res.locals.rooms = rooms;
            next();
            /* eslint-disable @typescript-eslint/no-explicit-any */
        } catch (err: any) {
            // Custom error for incorrect building
            if (err.errors[0].message === 'Invalid Input: filter') {
                return responses.badRequest(req, res);
            }

            return responses.internalServerError(req, res);
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
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const client = res.locals.oAuthClient;
            const rooms: roomData[] = res.locals.rooms;

            // Create id objects for freebusy query
            const calendarIds = _.map(rooms, (x: roomData) => {
                return { id: x.email };
            });

            // TODO: What should happen when the difference is e.g. 1 minute?
            const start = DateTime.now().toUTC().toISO();
            const end = DateTime.local().endOf('day').toUTC().toISO();

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
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const rooms: roomData[] = res.locals.rooms;
            const reservations = res.locals.roomReservations;

            _.forEach(rooms, (room: roomData) => {
                const email = room.email as string;
                room.nextCalendarEvent = reservations[email];
            });

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
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const cleanFeatures = (features: any): string[] => {
            if (!features) {
                return [];
            }

            /* eslint-disable @typescript-eslint/no-explicit-any */
            return features.map((x: any) => x.feature.name);
        };

        return {
            id: x.resourceId,
            name: x.resourceName,
            email: x.resourceEmail,
            capacity: x.capacity,
            building: x.buildingId,
            floor: x.floorName,
            features: cleanFeatures(x.featureInstances),
            nextCalendarEvent: '-1',
            location: x.generatedResourceName
        };
    });
};
