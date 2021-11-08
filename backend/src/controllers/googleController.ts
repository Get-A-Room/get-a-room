import express from 'express';
import { OAuth2Client } from 'google-auth-library';

import * as controller from './auth/google';
import { createToken } from './auth/token';
import { createUserMiddleware } from './userMiddleware';

export const router = express.Router();

const backendUrl = process.env.CALLBACK_URL || 'http://localhost:8080';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

/**
 * Returns a OAuth2Client to use for authentication
 * @param accessToken Optional. Access token to embed into client
 * @returns OAuth2Client
 */
export const getOAuthClient = (accessToken: string | undefined = undefined) => {
    const client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID || '',
        process.env.GOOGLE_CLIENT_SECRET || '',
        `${backendUrl}/api/auth/google/callback`
    );

    if (accessToken) {
        client.setCredentials({
            access_token: accessToken
        });
    }

    return client;
};

router.get('/', controller.redirectUrl(), (req, res) => {
    if (res.locals.authUrl) {
        return res.redirect(res.locals.authUrl);
    }

    return res.redirect(`${frontendUrl}/auth/failure`);
});

router.get(
    '/callback',
    controller.verifyCode(),
    controller.unpackPayload(),
    createUserMiddleware(),
    createToken(),
    (req, res) => {
        const payload = res.locals.payload;
        const name = payload.name;
        const token = res.locals.token;

        res.cookie('TOKEN', token, {
            maxAge: 31556952000, // 1 year
            httpOnly: true
        });

        res.redirect(`${frontendUrl}?name=${name}`);
    }
);
