import express from 'express';
import { google } from 'googleapis';
import 'dotenv/config';

export const router = express.Router();

const backendUrl = process.env.CALLBACK_URL || 'http://localhost:8080';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';

const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/admin.directory.resource.calendar.readonly'
];

/**
 * Returns a OAuth2Client to use for authentication
 * @param accessToken Optional. Access token to embed into client
 * @returns OAuth2Client
 */
export const getOAuthClient = (accessToken: string | undefined = undefined) => {
    const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID || '',
        process.env.GOOGLE_CLIENT_SECRET || '',
        `${backendUrl}/auth/google/callback`
    );

    if (accessToken) {
        client.setCredentials({
            access_token: accessToken
        });
    }

    return client;
};

router.get('/', async (req: express.Request, res: express.Response) => {
    const client = getOAuthClient();
    const url = client.generateAuthUrl({
        access_type: 'online', // When we are ready to receive
        scope: scopes,
        hd: 'oispahuone.com'
    });

    res.redirect(url);
});

router.get('/callback', async (req: express.Request, res: express.Response) => {
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

    const payload = await client
        .verifyIdToken({
            idToken: idToken
        })
        .then((ticket) => ticket.getPayload());

    if (payload?.hd !== 'oispahuone.com') {
        return res.redirect(`${frontendUrl}/auth/failure`);
    }

    // TODO:
    // If this is the users first time, save refresh token and other stuff to database

    // Sub is a unique identifier for an account that will not change
    // so it should be used as primary key when we start using a db

    // const sub = payload?.sub;
    const name = payload?.name;

    res.redirect(
        `${frontendUrl}/auth/success?token=${accessToken}&name=${name}`
    );
});
