import express from 'express';
import { OAuth2Client } from 'google-auth-library';

import BuildingData from '../types/buildingData';
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

/* eslint-disable @typescript-eslint/no-explicit-any */
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
        try {
            let building = res.locals.buildingId;

            if (!building) {
                building = req.query.building as string;
            }

            if (!building) {
                return next();
            }

            getBuildings(res.locals.oAuthClient)
                .then((result) => {
                    if (!result || result.length === 0) {
                        return responses.internalServerError(req, res);
                    }

                    const ids: string[] = result.map(
                        (x: BuildingData) => x.id as string
                    );

                    if (!ids.includes(building)) {
                        return responses.badRequest(req, res);
                    }

                    return next();
                })
                .catch((err) => {
                    console.error(err);
                    return next(err);
                });
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
const simplifyBuildingData = (result: schema.Building[]): BuildingData[] => {
    return result.map((x) => {
        return {
            id: x.buildingId,
            name: x.buildingName
        };
    });
};
