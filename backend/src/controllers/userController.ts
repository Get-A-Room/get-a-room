import { NextFunction, Request, Response } from 'express';
import UserModel, { User } from '../models/user';

const createUser = (subject: string, refreshToken: string) => {
    const userBase: User = {
        subject,
        refreshToken,
        preferences: {}
    };
    const user = new UserModel(userBase);
    return user.save();
};

export const createUserIfNew = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { sub, refreshToken } = res.locals;
    UserModel.findOne({ subject: sub })
        .then((foundUser: User | null) => {
            if (!foundUser) {
                return createUser(sub, refreshToken);
            } else {
                return foundUser;
            }
        })
        .then((user) => {
            res.locals.dbUser = user;
            next();
        });
};
