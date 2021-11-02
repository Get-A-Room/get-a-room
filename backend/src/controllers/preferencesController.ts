import { Request, Response, NextFunction } from 'express';

// import buildingData from '../interfaces/buildingData';
import { getUserWithSubject } from './userController';
import * as responses from '../utils/responses';

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
