import { Request, Response, NextFunction } from 'express';
import * as responses from '../utils/responses';
import { getBuildings } from './buildingsController';
import BuildingData from '../types/buildingData';

// Made this separate file due to testing issues :-(

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Middleware validates that a building belongs to the organization
 * @param req Express request
 * @param res Express response
 * @param next Next
 * @returns
 */
export const validateBuildingInOrg = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            let building = res.locals.buildingId;

            if (!building) {
                building = req.query.building as string;
            }

            if (!building) {
                return next();
            }

            const result = await getBuildings(res.locals.oAuthClient);

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
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};
