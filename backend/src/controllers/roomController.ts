import express from 'express';
import { google } from 'googleapis';
import _ from 'lodash';

import { getBuildings } from './buildingsController';

const admin = google.admin('directory_v1');
const calendar = google.calendar('v3');

/**
 * Middleware that adds all the rooms to the res.locals.rooms
 * @returns -
 */
export const addAllRooms = () => {
    const middleware = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        const client = res.locals.oAuthClient;
        const building = req.query.building as string;

        if (building) {
            try {
                const rooms = await getRoomsBuilding(building, client);

                if (rooms.length === 0) {
                    return res.status(204).json({
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
        } else {
            try {
                const rooms = await getRooms(client);

                if (rooms.length === 0) {
                    return res.status(204).json({
                        code: 204,
                        message: 'No Content'
                    });
                }

                res.locals.rooms = rooms;
                next();
            } catch {
                return res.status(500).json({
                    code: 500,
                    message: 'Internal Server Error'
                });
            }
        }
    };

    return middleware;
};

/**
 * Middleware that removes all the reserved rooms from the res.locals.rooms
 * Note: This is currently VERY slow!
 * @returns -
 */
export const removeReservedRooms = () => {
    const middleware = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        const client = res.locals.oAuthClient;
        const rooms = res.locals.rooms;

        if (req.query.showReserved) {
            next();
        }

        if (!rooms || rooms.length === 0) {
            return res.status(500).send({
                code: 500,
                message: 'Internal Server Error'
            });
        }

        // Create id objects for freebusy query
        const calendarIds = _.map(rooms, (x: any) => {
            return { id: x.email };
        });

        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + 60 * 60000);

        let results: any = {};
        let toRemove: string[] = [];

        // The query can support maximum of 50 items, so we need to split the rooms into
        // 50 item chunks and run the requests with those chunks.
        for (let i = 0; i < calendarIds.length; i += 50) {
            const runIds: any[] = _.slice(calendarIds, i, 50 + i);

            const result = await calendar.freebusy.query({
                requestBody: {
                    timeMin: startTime.toISOString(),
                    timeMax: endTime.toISOString(),
                    items: runIds,
                    calendarExpansionMax: runIds.length
                },
                auth: client
            });

            // Merge all query results into one object for later use
            _.merge(results, result.data.calendars);
        }

        _.forEach(calendarIds, (x: any) => {
            if (results[x.id] && results[x.id].busy.length !== 0) {
                toRemove.push(x.id);
            }
        });

        _.remove(rooms, (room: any) => {
            if (toRemove.includes(room.email)) {
                return true;
            }
            return false;
        });

        next();
    };

    return middleware;
};

/**
 * Middleware validates that a building belongs to the organization
 * @param req Express request
 * @param res Express response
 * @param next Next
 * @returns -
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
 * Return all rooms in the organization
 * @param client OAuth2Client
 * @returns -
 */
const getRooms = async (client: any) => {
    const rooms = await admin.resources.calendars.list({
        customer: process.env.GOOGLE_CUSTOMER_ID,
        orderBy: 'buildingId, capacity desc',
        query: `resourceCategory=CONFERENCE_ROOM`,
        auth: client
    });

    // TODO: Add support for multiple pages

    if (!rooms.data.items) {
        return [];
    }

    return simplifyResultData(rooms);
};

/**
 * Return all rooms inside the building
 * @param building buildingId of the building
 * @param client OAuth2Client
 * @returns -
 */
const getRoomsBuilding = async (building: any, client: any) => {
    const rooms = await admin.resources.calendars.list({
        customer: process.env.GOOGLE_CUSTOMER_ID,
        orderBy: 'capacity desc',
        query: `resourceCategory=CONFERENCE_ROOM AND buildingId=${building}`,
        auth: client
    });

    if (!rooms.data.items) {
        return [];
    }

    return simplifyResultData(rooms);
};

/**
 * Simplify results from Google
 * @param result Results from Google API
 * @returns simplified results
 */
const simplifyResultData = (result: any) => {
    return result.data.items?.map((x: any) => {
        const cleanFeatures = (features: any) => {
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
            availableFor: 0
        };
    });
};
