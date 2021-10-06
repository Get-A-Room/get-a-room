import express from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

/**
 * Validates JWT and saves the decrypted content to req.user
 * @param noAuthPaths Array of paths that don't require autentication
 * @returns -
 */
export const jwtValidator = (noAuthPaths: string[]) => {
    const middleware = (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).send({
                message: 'No JWT secret provided, refusing to authenticate'
            });
        }

        // Some paths do not require authentication
        if (req.path === '/' || noAuthPaths.some((v) => req.path.includes(v))) {
            return next();
        }

        if (!req.headers.authorization) {
            return res.status(401).send({
                message: 'Invalid token'
            });
        }

        const bearerHeader = req.headers.authorization;
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, jwtSecret, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).send({
                        message: 'Token expired'
                    });
                }

                return res.status(401).send({
                    message: 'Invalid token'
                });
            }

            req.user = decoded;
            next();
        });
    };

    return middleware;
};
