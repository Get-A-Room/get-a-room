import { getOAuthClient } from './oAuthClient';
import { OAuth2Client } from 'google-auth-library';

describe('oAuthClient', () => {
    describe('getOAuthClient', () => {
        test('Should generate new OAuth2Client', () => {
            const result = getOAuthClient();
            expect(result).toBeInstanceOf(OAuth2Client);
            expect(result.credentials.access_token).toEqual(undefined);
        });
        test('Should set access token in to the client when given', () => {
            const result = getOAuthClient('token');
            expect(result).toBeInstanceOf(OAuth2Client);
            expect(result.credentials.access_token).toEqual('token');
        });
    });
});
