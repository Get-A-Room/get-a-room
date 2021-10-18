import express from 'express';
import { OAuth2Client } from 'google-auth-library';

import buildingData from './../interfaces/buildingData';
import * as admin from './googleAPI/adminAPI';
import * as responses from '../utils/responses';
import * as schema from '../utils/googleSchema';

/**
 * Add all buildings in the organization to res.locals.buildings
 * @returns -
 */
export const getBuildingsMiddleware = () => {
    const middleware = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const client: OAuth2Client = res.locals.oAuthClient;
            const buildings = await admin.getBuildingData(client);

            if (buildings.length === 0) {
                return responses.internalServerError(req, res);
            }

            res.locals.buildings = simplifyBuildingData(buildings);
            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};

/**
 * Return all buildings in the organization as an array for other uses
 * @param client OAuth2Client to use for authentication
 * @returns array of buildingData
 */
export const getBuildings = async (client: OAuth2Client) => {
    const buildings = await admin.getBuildingData(client);
    return simplifyBuildingData(buildings);
};

/**
 * Simplify results from Google
 * @param result Results from Google API
 * @returns simplified results
 */
const simplifyBuildingData = (result: schema.Building[]): buildingData[] => {
    return result.map((x) => {
        return {
            buildingId: x.buildingId,
            buildingName: x.buildingName,
            floorNames: x.floorNames,
            description: x.description
        };
    });
};
