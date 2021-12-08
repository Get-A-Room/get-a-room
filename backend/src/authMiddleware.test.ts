import { Request, Response } from 'express';
import { mocked } from 'ts-jest/utils';
import { authFilter, parseToken, validateAccessToken } from './authMiddleware';
import { invalidToken } from './utils/responses';
import { readToken, updateToken } from './controllers/auth/token';
import { OAuth2Client } from 'google-auth-library';

jest.mock('./utils/responses');
jest.mock('./controllers/auth/token');
jest.mock('google-auth-library');

const mockedInvalidToken = mocked(invalidToken, false);
const mockedReadToken = mocked(readToken, false);
const mockedUpdateToken = mocked(updateToken, false);
const mockedAuth = mocked(OAuth2Client, true);

describe('authMiddleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    describe('authFilter', () => {
        beforeEach(() => {
            mockRequest = {
                path: '/'
            };
            mockResponse = {};
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should return true when path is "/api"', () => {
            mockRequest.path = '/api';
            expect(authFilter(mockRequest as Request)).toEqual(true);
        });

        test('Should return true when path contains "/api/auth"', () => {
            mockRequest.path = '/api/auth/google';
            expect(authFilter(mockRequest as Request)).toEqual(true);
        });

        test('Should return true when path is "/api/favicon.ico"', () => {
            mockRequest.path = '/api/favicon.ico';
            expect(authFilter(mockRequest as Request)).toEqual(true);
        });

        test('Should return false when path is something else', () => {
            mockRequest.path = '/api/buildings';
            expect(authFilter(mockRequest as Request)).toEqual(false);
        });
    });

    describe('parseToken', () => {
        beforeEach(() => {
            mockRequest = {
                cookies: {
                    TOKEN: 'token'
                }
            };
            mockResponse = {
                locals: {}
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should return with Invalid Token when TOKEN is not in cookies', async () => {
            mockRequest.cookies = {};

            await parseToken()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedInvalidToken).toBeCalledTimes(1);
        });

        test('Should return with Invalid Token when refresh token is not in TOKEN payload', async () => {
            mockedReadToken.mockReturnValueOnce({
                sub: 'sub',
                name: 'name',
                email: 'email',
                accessToken: 'token',
                refreshToken: ''
            });

            await parseToken()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedInvalidToken).toBeCalledTimes(1);
        });

        test('Should set TOKEN payload to locals', async () => {
            const payload = {
                sub: 'sub',
                name: 'name',
                email: 'email',
                accessToken: 'token',
                refreshToken: 'rtoken'
            };

            mockedReadToken.mockReturnValueOnce(payload);

            await parseToken()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledWith();
            expect(mockNext).toBeCalledTimes(1);
            expect(mockResponse.locals?.sub).toEqual(payload.sub);
            expect(mockResponse.locals?.email).toEqual(payload.email);
            expect(mockResponse.locals?.accessToken).toEqual(
                payload.accessToken
            );
            expect(mockResponse.locals?.refreshToken).toEqual(
                payload.refreshToken
            );
        });
    });

    describe('validateAccessToken', () => {
        beforeEach(() => {
            mockRequest = {
                cookies: {
                    token: 'cookieToken'
                }
            };
            mockResponse = {
                locals: {
                    accessToken: 'token',
                    refreshToken: 'rToken'
                },
                cookie: jest.fn()
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should return with Invalid Token when client returns no access token', async () => {
            mockedAuth.prototype.getAccessToken.mockImplementationOnce(() => {
                return {
                    token: null,
                    res: null
                };
            });

            await validateAccessToken()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedAuth.prototype.setCredentials).toBeCalledTimes(1);
            expect(mockedAuth.prototype.getAccessToken).toBeCalledTimes(1);
            expect(mockedInvalidToken).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalled();
        });

        test('Should set new token to cookie when old access token is different', async () => {
            mockedAuth.prototype.getAccessToken.mockImplementationOnce(() => {
                return {
                    token: 'differentToken',
                    res: null
                };
            });
            mockedUpdateToken.mockReturnValue('newCookie');

            await validateAccessToken()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
            expect(mockResponse.cookie).toHaveBeenCalledWith(
                'TOKEN',
                'newCookie',
                {
                    maxAge: 31556952000,
                    httpOnly: true
                }
            );
            expect(mockResponse.locals?.accessToken).toEqual('differentToken');
        });
    });
});
