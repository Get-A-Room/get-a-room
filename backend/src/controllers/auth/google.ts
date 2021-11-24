import { Request, Response, NextFunction } from 'express';
import { getOAuthClient } from '../googleController';
import { OAuth2Client } from 'google-auth-library';

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/admin.directory.resource.calendar.readonly'
];

/**
 * Generate auth URL and add it to res.locals.authUrl
 * @returns
 */
export const redirectUrl = () => {
    const middleware = (req: Request, res: Response, next: NextFunction) => {
        try {
            const client = getOAuthClient();
            const url = client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes,
                hd: process.env.HOSTED_DOMAIN
            });

            res.locals.authUrl = url;
            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};

/**
 * Verify code received from Google and save the created OAuth2Client
 * to res.locals.oAuthClient
 * @returns
 */
export const verifyCode = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.query.code) {
                console.error(`ERROR - "No code"`);
                return res.redirect(`${frontendUrl}/auth/failure?code=401`);
            }

            const code: string = req.query.code as string;
            const client = getOAuthClient();
            const { tokens } = await client.getToken(code);

            client.setCredentials(tokens);
            const accessToken = tokens.access_token as string;
            const refreshToken = tokens.refresh_token as string;
            const idToken = tokens.id_token as string;

            if (!idToken || !accessToken) {
                return res.redirect(`${frontendUrl}/auth/failure?code=500`);
            }

            res.locals.oAuthClient = client;
            res.locals.accessToken = accessToken;
            res.locals.refreshToken = refreshToken;
            next();
        } catch (err) {
            return res.redirect(`${frontendUrl}/auth/failure?code=500`);
        }
    };

    return middleware;
};

/**
 * Unpacks payload and adds it to res.locals.payload
 * @returns
 */
export const unpackPayload = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const client: OAuth2Client = res.locals.oAuthClient;
            const idToken = client.credentials.id_token as string;

            const ticket = await client.verifyIdToken({ idToken: idToken });
            const payload = ticket.getPayload();

            if (payload?.hd !== process.env.HOSTED_DOMAIN) {
                return res.redirect(`${frontendUrl}/auth/failure?code=401`);
            }

            res.locals.payload = payload;
            next();
        } catch (err) {
            return res.redirect(`${frontendUrl}/auth/failure?code=500`);
        }
    };

    return middleware;
};
