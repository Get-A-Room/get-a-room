import express from 'express';
import { google } from 'googleapis';

const admin = google.admin('directory_v1');

/**
 * Get all buildings in the organization
 * @param req Express request
 * @param res Express response
 * @returns -
 */
export const getBuildings = async (
    req: express.Request,
    res: express.Response
) => {
    const client = req.oAuthClient;

    admin.resources.buildings
        .list({
            customer: process.env.GOOGLE_CUSTOMER_ID,
            auth: client
        })
        .then((result) => {
            if (!result.data.buildings) {
                return res.status(204).json({
                    code: 204,
                    message: 'No Content'
                });
            }

            const buildings = result.data.buildings?.map((x) => {
                return {
                    buildingId: x.buildingId,
                    buildingName: x.buildingName,
                    floornames: x.floorNames,
                    description: x.description
                };
            });

            res.json({ buildings });
        })
        .catch(() => {
            return res.status(500).json({
                code: 500,
                message: 'Internal Server Error'
            });
        });
};
