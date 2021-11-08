import express from 'express';
import unless from 'express-unless';
import { getOAuthClient } from './controllers/googleController';
import * as responses from './utils/responses';

/**
 * Filter for unless
 * @param req Express request
 * @returns {boolean}
 */
export const authFilter = (req: express.Request) => {
    const path = req.path;
    const skipPaths = ['/api/auth', '/api/api-docs', '/api/favicon.ico'];

    if (path === '/api') {
        return true;
    }

    if (skipPaths.some((v) => path.includes(v))) {
        return true;
    }

    return false;
};

/**
 * Parses access token from headers and refresh token from
 * httpOnly cookie and sets them to res.locals
 * @returns -
 */
export const parseTokens = () => {
    const middleware = (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        const { refreshToken, token } = req.cookies;

        if (!refreshToken) {
            return responses.invalidToken(req, res);
        }

        res.locals.refreshToken = refreshToken;
        res.locals.token = token;

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
    const middleware = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const client = getOAuthClient();
            const token = res.locals.token;
            const refreshToken = res.locals.refreshToken;

            client.setCredentials({
                access_token: token,
                refresh_token: refreshToken
            });

            const newToken = (await client.getAccessToken()).token;

            // Token had expired
            if (token !== newToken) {
                res.locals.token = newToken;
                res.cookie('token', newToken, {
                    maxAge: 3600000, // 60 minutes
                    httpOnly: true
                });
            }

            const tokenInfo = await client.getTokenInfo(res.locals.token);
            res.locals.oAuthClient = client;
            res.locals.email = tokenInfo.email;
            res.locals.sub = tokenInfo.sub;
            next();
        } catch {
            return responses.invalidToken(req, res);
        }
    };

    middleware.unless = unless;

    return middleware;
};
