import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from 'google-auth-library';
import {
    createUserFromTokenPayload,
    getUserWithSubject
} from './userController';

export const createUserMiddleware = () => {
    const middleware = (req: Request, res: Response, next: NextFunction) => {
        const authTokenPayload = res.locals.payload as TokenPayload | undefined;
        const refreshToken = res.locals.refreshToken as string | undefined;

        if (!authTokenPayload) {
            throw new Error('Token payload missing');
        }

        return getUserWithSubject(authTokenPayload.sub)
            .then((foundUser) => {
                // If new refresh token is received, always update it to db
                if (!foundUser || refreshToken) {
                    return createUserFromTokenPayload(
                        authTokenPayload,
                        refreshToken
                    );
                } else {
                    return foundUser;
                }
            })
            .then((user) => {
                res.locals.refreshToken = user.refreshToken;
                next();
            })
            .catch((err) => {
                next(err);
            });
    };
    return middleware;
};
