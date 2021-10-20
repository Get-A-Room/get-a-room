import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from 'google-auth-library';
import {
    createUserFromTokenPayload,
    getUserWithSubject
} from './userController';

export const createUserMiddleware = () => {
    const middleware = (req: Request, res: Response, next: NextFunction) => {
        const authTokenPayload = res.locals.payload as TokenPayload | undefined;
        if (!authTokenPayload) {
            throw new Error('Token payload missing');
        }
        return getUserWithSubject(authTokenPayload.sub)
            .then((foundUser) => {
                if (!foundUser) {
                    return createUserFromTokenPayload(authTokenPayload);
                } else {
                    return foundUser;
                }
            })
            .then(() => {
                next();
            })
            .catch((err) => {
                next(err);
            });
    };
    return middleware;
};
