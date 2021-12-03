import { OAuth2Client } from 'google-auth-library';

const backendUrl = process.env.CALLBACK_URL || 'http://localhost:8080';

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
