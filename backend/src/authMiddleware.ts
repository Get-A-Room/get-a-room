import express from 'express';
import unless from 'express-unless';
import { getOAuthClient } from './controllers/googleAuthController';
import 'dotenv/config';

/**
 * Filter for unless
 * @param req Express request
 * @returns {boolean}
 */
export const authFilter = (req: express.Request) => {
    const path = req.path;
    const skipPaths = ['/auth', '/api-docs'];

    if (path === '/') {
        return true;
    }

    if (skipPaths.some((v) => path.includes(v))) {
        return true;
    }

    return false;
};

/**
 * Parses access token from headers and sets it to req.token but does not validate it
 * @returns -
 */
export const parseAccessToken = () => {
    const middleware = (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (!req.headers.authorization) {
            return res.status(401).send({
                code: 401,
                message: 'Invalid token'
            });
        }

        const bearerHeader = req.headers.authorization;
        const bearer = bearerHeader.split(' ');
        const accessToken = bearer[1];
        req.token = accessToken;

        next();
    };

    middleware.unless = unless;

    return middleware;
};

/**
 * Validate that the access token included in the authorization header is valid
 * if not, check for refresh token and if found try to refresh the access token
 * @param noAuthPaths Array of paths that don't require autentication
 * @returns -
 */
export const validateAccessToken = () => {
    const middleware = (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (!req.headers.authorization) {
            return res.status(401).send({
                code: 401,
                message: 'Invalid token'
            });
        }

        const client = getOAuthClient();
        const accessToken = req.token;

        client
            .getTokenInfo(accessToken)
            .then((tokenInfo) => {
                const currentTime = new Date().getTime();

                // Access token is still valid
                if (currentTime < tokenInfo.expiry_date) {
                    client.setCredentials({ access_token: accessToken });
                    req.oAuthClient = client;

                    return next();
                }

                // Retrieve refresh token and refresh access token with it
                // Find a way to pass new access token back to frontend
                // const sub = tokenInfo.sub as string;
                req.token = accessToken;
                client.setCredentials({ access_token: accessToken });
                req.oAuthClient = client;

                return next();
            })
            .catch(() => {
                return res.status(401).send({
                    code: 401,
                    message: 'Invalid token'
                });
            });
    };

    middleware.unless = unless;

    return middleware;
};
