import express from 'express';
import { getOAuthClient } from '../googleController';
import { OAuth2Client } from 'google-auth-library';
import 'dotenv/config';

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/admin.directory.resource.calendar.readonly'
];

/**
 * Generate auth URL and add it to res.locals.authUrl
 * @returns -
 */
export const redirectUrl = () => {
    const middleware = (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        const client = getOAuthClient();
        const url = client.generateAuthUrl({
            access_type: 'online', // When we are ready to receive refresh_token change this offline
            scope: scopes,
            hd: process.env.HOSTED_DOMAIN
        });

        res.locals.authUrl = url;
        next();
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
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (!req.query.code) {
            res.status(500).send({
                code: 500,
                message: 'Internal Server Error'
            });
        }

        const code: string = req.query.code as string;
        const client = getOAuthClient();
        const { tokens } = await client.getToken(code);

        client.setCredentials(tokens);
        const accessToken = tokens.access_token as string;
        const idToken = tokens.id_token as string;

        if (!idToken || !accessToken) {
            return res.redirect(`${frontendUrl}/auth/failure`);
        }

        res.locals.oAuthClient = client;
        res.locals.token = accessToken;
        next();
    };

    return middleware;
};

/**
 * Unpacks payload and adds it to res.locals.payload
 * @returns -
 */
export const unpackPayload = () => {
    const middleware = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        const client: OAuth2Client = res.locals.oAuthClient;
        const idToken = client.credentials.id_token as string;

        const ticket = await client.verifyIdToken({ idToken: idToken });
        const payload = ticket.getPayload();

        if (payload?.hd !== 'oispahuone.com') {
            return res.redirect(`${frontendUrl}/auth/failure`);
        }

        res.locals.payload = payload;
        next();
    };

    return middleware;
};
