import express from 'express';
import { google } from 'googleapis';
import 'dotenv/config';

const admin = google.admin('directory_v1');

/**
 * Get all rooms in the given building
 * @param req Express request
 * @param res Express response
 * @param buildingId Id of the building
 * @returns -
 */
export const getRoomsBuilding = (
    req: express.Request,
    res: express.Response,
    buildingId: any
) => {
    const client = req.oAuthClient;

    // TODO: Validate given building against real data

    admin.resources.calendars
        .list({
            customer: process.env.GOOGLE_CUSTOMER_ID,
            orderBy: 'capacity desc',
            query: `resourceCategory=CONFERENCE_ROOM AND buildingId=${buildingId}`,
            auth: client
        })
        .then((result) => {
            if (!result.data.items) {
                return res.status(204).json({
                    code: 204,
                    message: 'No Content'
                });
            }

            return res.json({ rooms: simplifyResultData(result) });
        })
        .catch((err) => {
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
        });
};

/**
 * Get all rooms in the organization
 * @param req Express request
 * @param res Express response
 * @returns -
 */
export const getRooms = async (req: express.Request, res: express.Response) => {
    const client = req.oAuthClient;

    // TODO: Add support for multiple pages (over 500 results)

    admin.resources.calendars
        .list({
            customer: process.env.GOOGLE_CUSTOMER_ID,
            orderBy: 'buildingId, capacity desc',
            query: `resourceCategory=CONFERENCE_ROOM`,
            auth: client
        })
        .then((result) => {
            if (!result.data.items) {
                return res.status(204).json({
                    code: 204,
                    message: 'No Content'
                });
            }

            return res.json({ rooms: simplifyResultData(result) });
        })
        .catch(() => {
            return res.status(500).json({
                code: 500,
                message: 'Internal Server Error'
            });
        });
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
