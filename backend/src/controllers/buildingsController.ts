import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

const admin = google.admin('directory_v1');

/**
 * Send all buildings in the organization
 * @param req Express request
 * @param res Express response
 * @returns -
 */
export const sendBuildings = async (
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

            res.json({ buildings: simplifyResultData(result) });
        })
        .catch(() => {
            return res.status(500).json({
                code: 500,
                message: 'Internal Server Error'
            });
        });
};

/**
 * Return all buildings in the organization as an array for other uses
 * @param client OAuth2Client to use for authentication
 */
export const getBuildings = (client: OAuth2Client) => {
    return admin.resources.buildings
        .list({
            customer: process.env.GOOGLE_CUSTOMER_ID,
            auth: client
        })
        .then((result) => {
            if (!result.data.buildings) {
                return [];
            }

            return simplifyResultData(result);
        })
        .catch(() => {
            return [];
        });
};

/**
 * Simplify results from Google
 * @param result Results from Google API
 * @returns simplified results
 */
const simplifyResultData = (result: any) => {
    return result.data.buildings?.map((x: any) => {
        return {
            buildingId: x.buildingId,
            buildingName: x.buildingName,
            floorNames: x.floorNames,
            description: x.description
        };
    });
};
