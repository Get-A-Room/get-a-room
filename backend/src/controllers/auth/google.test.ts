import { Request, Response } from 'express';
import {
    handleAuthCallback,
    redirectToAuthUrl,
    redirectUrl,
    unpackPayload,
    verifyCode
} from './google';
import { Credentials, LoginTicket, OAuth2Client } from 'google-auth-library';
import { mocked } from 'ts-jest/utils';
import { DateTime } from 'luxon';

jest.mock('google-auth-library');

const mockedAuth = mocked(OAuth2Client, true);
const mockedTicket = mocked(LoginTicket, true);

describe('google', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        mockRequest = {
            query: {
                code: 'testGoogleCode'
            }
        };
        mockResponse = {
            locals: {},
            redirect: jest.fn(),
            clearCookie: jest.fn(),
            cookie: jest.fn()
        };
        mockNext = jest.fn();

        process.env.HOSTED_DOMAIN = 'testDomain.com';

        jest.resetAllMocks();
    });

    describe('handleAuthCallback', () => {
        test('Should set cookie TOKEN and redirect user forward', async () => {
            mockResponse.locals = {
                token: 'tokenToSet'
            };

            await handleAuthCallback()(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
            expect(mockResponse.cookie).toHaveBeenCalledWith(
                'TOKEN',
                'tokenToSet',
                { httpOnly: true, maxAge: 31556952000 }
            );
            expect(mockResponse.redirect).toHaveBeenCalledTimes(1);
        });
    });

    describe('redirectToAuthUrl', () => {
        test('Should redirect to authentication URL', async () => {
            const url = 'https://authurl.com';

            if (mockResponse.locals) {
                mockResponse.locals.authUrl = url;
            }

            await redirectToAuthUrl()(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.redirect).toHaveBeenCalledTimes(1);
            expect(mockResponse.redirect).toHaveBeenCalledWith(url);
        });

        test('Should clear TOKEN cookie redirect to login on failure', async () => {
            await redirectToAuthUrl()(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.clearCookie).toHaveBeenCalledTimes(1);
            expect(mockResponse.redirect).toHaveBeenCalledTimes(1);
        });
    });

    describe('redirectUrl', () => {
        test('Should set generated url to locals', async () => {
            mockedAuth.prototype.generateAuthUrl.mockImplementationOnce(() => {
                return 'https://testurl.com';
            });

            await redirectUrl()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.locals?.authUrl).toEqual('https://testurl.com');
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toBeCalledWith();
        });
    });

    describe('unpackPayload', () => {
        const testPayload = {
            iss: 'https://accounts.google.com',
            sub: 'testSub',
            aud: 'testAud',
            iat: DateTime.now().toUTC().toSeconds(),
            exp: DateTime.now().plus({ minutes: 60 }).toUTC().toSeconds(),
            hd: 'testDomain.com'
        };

        beforeEach(() => {
            mockResponse.locals = {
                oAuthClient: new OAuth2Client()
            };

            mockedAuth.prototype.credentials = {
                refresh_token: null,
                access_token: null,
                id_token: 'idToken',
                token_type: 'Bearer',
                scope: '',
                expiry_date: null
            };

            mockedAuth.prototype.verifyIdToken.mockImplementation(async () => {
                return new LoginTicket(undefined, {
                    iss: 'https://accounts.google.com',
                    sub: 'testSub',
                    aud: 'testAud',
                    iat: DateTime.now().toUTC().toSeconds(),
                    exp: DateTime.now()
                        .plus({ minutes: 60 })
                        .toUTC()
                        .toSeconds(),
                    name: 'testName',
                    email: 'test@email.com'
                });
            });
        });

        test('Should fail redirect when hosted domain is incorrect', async () => {
            mockedTicket.prototype.getPayload.mockImplementationOnce(() => {
                const payload = testPayload;
                payload.hd = 'wrongDomain.com';
                return payload;
            });

            await unpackPayload()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.redirect).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalled();
        });

        test('Should set user data payload to locals', async () => {
            mockedTicket.prototype.getPayload.mockImplementationOnce(() => {
                const payload = testPayload;
                payload.hd = 'testDomain.com';
                return payload;
            });

            await unpackPayload()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.locals?.payload).toEqual(testPayload);
            expect(mockResponse.redirect).not.toBeCalled();
            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
        });
    });

    describe('verifyCode', () => {
        test('Should fail redirect when code is missing', async () => {
            mockRequest = {
                query: {
                    code: undefined
                }
            };

            await verifyCode()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.redirect).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalled();
        });

        test('Should fail redirect when id token is missing', async () => {
            const tokens: Credentials = {
                access_token: 'token',
                refresh_token: 'rtoken'
            };

            mockedAuth.prototype.getToken.mockImplementationOnce(async () => {
                return {
                    tokens,
                    res: null
                };
            });

            await verifyCode()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedAuth.prototype.getToken).toBeCalledTimes(1);
            expect(mockedAuth.prototype.setCredentials).toBeCalledTimes(1);
            expect(mockedAuth.prototype.setCredentials).toBeCalledWith(tokens);
            expect(mockResponse.redirect).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalled();
        });

        test('Should fail redirect when access token is missing', async () => {
            const tokens: Credentials = {
                id_token: 'idtoken',
                refresh_token: 'rtoken'
            };

            mockedAuth.prototype.getToken.mockImplementationOnce(async () => {
                return {
                    tokens,
                    res: null
                };
            });

            await verifyCode()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.redirect).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalled();
        });

        test('Should set values to locals', async () => {
            const tokens: Credentials = {
                id_token: 'idtoken',
                access_token: 'token',
                refresh_token: 'rtoken'
            };

            mockedAuth.prototype.getToken.mockImplementationOnce(async () => {
                return {
                    tokens,
                    res: null
                };
            });

            await verifyCode()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.locals?.accessToken).toEqual('token');
            expect(mockResponse.locals?.refreshToken).toEqual('rtoken');
            expect(mockResponse.redirect).not.toBeCalled();
            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
        });
    });
});
