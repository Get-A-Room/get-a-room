import express from 'express';
import _ from 'lodash';
import { admin_directory_v1 } from 'googleapis';
import { DateTime } from 'luxon';

import * as admin from './googleAPI/adminAPI';
import * as calendar from './googleAPI/calendarAPI';
import roomData from '../interfaces/roomData';
import { getBuildings } from './buildingsController';

/**
 * Middleware validates that a building belongs to the organization
 * @param req Express request
 * @param res Express response
 * @param next Next
 * @returns
 */
export const validateBuildingInOrg = () => {
    const middleware = (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        const building = req.query.building as string;

        if (!building) {
            return next();
        }

        getBuildings(res.locals.oAuthClient)
            .then((result) => {
                if (!result || result.length === 0) {
                    return res.status(500).send({
                        code: 500,
                        message: 'Internal Server Error'
                    });
                }

                const ids: string[] = result.map((x: any) => x.buildingId);

                if (!ids.includes(building)) {
                    return res.status(400).send({
                        code: 400,
                        message: 'Bad Request'
                    });
                }

                return next();
            })
            .catch((err) => {
                console.error(err);
                return next();
            });
    };

    return middleware;
};

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
            let result: admin_directory_v1.Schema$CalendarResource[];
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
        } catch (err: any) {
            // Custom error for incorrect building
            if (err.errors[0].message === 'Invalid Input: filter') {
                return res.status(400).json({
                    code: 400,
                    message: 'Bad Request'
                });
            }

            return res.status(500).json({
                code: 500,
                message: 'Internal Server Error'
            });
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
        const rooms: roomData[] = res.locals.rooms;
        const reservations = res.locals.roomReservations;

        _.forEach(rooms, (room: roomData) => {
            const email = room.email as string;
            room.nextCalendarEvent = reservations[email];
        });

        // console.log(rooms);

        next();
    };

    return middleware;
};

/**
 * Simplify results from Google
 * @param result Results from Google API
 * @returns simplified results
 */
const simplifyRoomData = (
    result: admin_directory_v1.Schema$CalendarResource[]
): roomData[] => {
    return result.map((x) => {
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
            id: x.resourceId,
            name: x.resourceName,
            email: x.resourceEmail,
            capacity: x.capacity,
            building: x.buildingId,
            floor: x.floorName,
            features: cleanFeatures(x.featureInstances),
            nextCalendarEvent: '-1'
        };
    });
};
