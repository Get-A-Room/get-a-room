import express from 'express';
import { getOAuthClient } from './controllers/googleAuthController';
import 'dotenv/config';

/**
 * Validate that the access token included in the authorization header is valid
 * if not, check for refresh token and if found try to refresh the access token
 * @param noAuthPaths Array of paths that don't require autentication
 * @returns -
 */
export const accessTokenValidator = (noAuthPaths: string[]) => {
    const middleware = (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        // Some paths do not require authentication
        if (req.path === '/' || noAuthPaths.some((v) => req.path.includes(v))) {
            return next();
        }

        if (!req.headers.authorization) {
            return res.status(401).send({
                code: 401,
                message: 'Invalid token'
            });
        }

        const client = getOAuthClient();
        const bearerHeader = req.headers.authorization;
        const bearer = bearerHeader.split(' ');
        const accessToken = bearer[1];

        client
            .getTokenInfo(accessToken)
            .then((tokenInfo) => {
                const currentTime = new Date().getTime();

                // Access token is still valid
                if (currentTime < tokenInfo.expiry_date) {
                    req.token = accessToken;
                    next();
                }

                // Retrieve refresh token and refresh access token with it
                // Find a way to pass new access token back to frontend
                // const sub = tokenInfo.sub as string;
                req.token = accessToken;
                next();
            })
            .catch(() => {
                return res.status(401).send({
                    code: 401,
                    message: 'Invalid token'
                });
            });
    };

    return middleware;
};
