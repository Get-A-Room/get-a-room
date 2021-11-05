import { Request, Response, NextFunction } from 'express';

import { getUserWithSubject, updatePreferences } from './userController';
import * as responses from '../utils/responses';
import BuildingData from '../types/buildingData';
import Preferences from '../types/preferences';

/**
 * Gets current users preferences from DB
 * @returns
 */
export const getPreferences = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const sub = res.locals.sub;

            if (!sub) {
                return responses.badRequest(req, res);
            }

            const user = await getUserWithSubject(sub);

            if (!user) {
                return responses.internalServerError(req, res);
            }

            res.locals.preferences = user.preferences;
            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};
