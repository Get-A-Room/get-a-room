import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';
import { createUser, getUserWithSubject } from './userController';

export const createUserMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { sub, refreshToken } = res.locals;
    return getUserWithSubject(sub)
        .then((foundUser) => {
            if (!foundUser) {
                return createUser(sub, refreshToken);
            } else {
                return foundUser;
            }
        })
        .then((_user) => {
            next();
        })
        .catch((err) => {
            next(err);
        });
};
