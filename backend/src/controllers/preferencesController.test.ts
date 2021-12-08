import { Request, Response } from 'express';
import { getUserWithSubject, updatePreferences } from './userController';
import { badRequest, internalServerError } from '../utils/responses';
import {
    getPreferences,
    readPrefenceBody,
    updatePreferencesToDatabase
} from './preferencesController';
import { mocked } from 'ts-jest/utils';

jest.mock('../utils/responses');
jest.mock('./userController');

const mockedGetUserWithSubject = mocked(getUserWithSubject, false);
const mockedUpdatePreferences = mocked(updatePreferences, false);
const mockedBadRequest = mocked(badRequest, false);
const mockedInternalServerError = mocked(internalServerError, false);

describe('preferencesController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    describe('getPreferences', () => {
        beforeEach(() => {
            mockRequest = {};
            mockResponse = {
                locals: {
                    sub: 'sub'
                }
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should respond with bad request if subject is missing', async () => {
            mockResponse = {
                locals: {
                    sub: undefined
                }
            };

            await getPreferences()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedBadRequest).toBeCalledTimes(1);
            expect(mockedInternalServerError).not.toBeCalled();
            expect(mockedGetUserWithSubject).not.toBeCalled();
        });

        test('Should respond with internal server error if user is not found', async () => {
            mockedGetUserWithSubject.mockResolvedValueOnce(null);

            await getPreferences()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedBadRequest).not.toBeCalled();
            expect(mockedInternalServerError).toBeCalledTimes(1);
            expect(mockedGetUserWithSubject).toBeCalledTimes(1);
            expect(mockedGetUserWithSubject).toBeCalledWith('sub');
        });

        test('Should add preferences to res.locals if successful', async () => {
            const building = {
                name: 'building',
                id: 'id'
            };

            mockedGetUserWithSubject.mockResolvedValueOnce({
                subject: 'sub',
                preferences: {
                    building
                }
            });

            await getPreferences()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockedBadRequest).not.toBeCalled();
            expect(mockedInternalServerError).not.toBeCalled();
            expect(mockedGetUserWithSubject).toBeCalledTimes(1);
            expect(mockedGetUserWithSubject).toBeCalledWith('sub');
            expect(mockResponse.locals?.preferences.building).toEqual(building);
        });
    });

    describe('readPreferenceBody', () => {
        beforeEach(() => {
            mockRequest = {
                body: {
                    building: {
                        id: 'test',
                        name: 'test'
                    }
                }
            };
            mockResponse = {
                locals: {}
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should set buildingId and buildingName to locals', async () => {
            await readPrefenceBody()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledWith();
            expect(mockNext).toBeCalledTimes(1);
            expect(mockResponse.locals?.buildingId).toEqual(
                mockRequest.body.building.id
            );
            expect(mockResponse.locals?.buildingName).toEqual(
                mockRequest.body.building.name
            );
        });

        test('Should return bad request if building is not set', async () => {
            delete mockRequest.body.building;

            await readPrefenceBody()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(0);
            expect(mockedBadRequest).toBeCalledTimes(1);
        });

        test('Should return bad request if id is not set', async () => {
            delete mockRequest.body.building.id;

            await readPrefenceBody()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(0);
            expect(mockedBadRequest).toBeCalledTimes(1);
        });

        test('Should return bad request if name is not set', async () => {
            delete mockRequest.body.building.name;

            await readPrefenceBody()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(0);
            expect(mockedBadRequest).toBeCalledTimes(1);
        });
    });

    describe('updatePreferencesToDatabase', () => {
        beforeEach(() => {
            mockRequest = {};
            mockResponse = {
                locals: {
                    sub: 'sub',
                    buildingId: 'test',
                    buildingName: 'test'
                }
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should return bad request if subject is missing', async () => {
            delete mockResponse.locals?.sub;

            await updatePreferencesToDatabase()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedBadRequest).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalled();
        });

        test('Should return internal server error if user is not returned', async () => {
            mockedUpdatePreferences.mockResolvedValueOnce(null);

            await updatePreferencesToDatabase()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedInternalServerError).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalled();
        });

        test('Should set preferences to locals', async () => {
            mockedUpdatePreferences.mockResolvedValueOnce({
                subject: 'sub',
                preferences: {
                    building: {
                        id: 'test',
                        name: 'test'
                    }
                }
            });

            await updatePreferencesToDatabase()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockResponse.locals?.preferences).toEqual({
                building: {
                    id: mockResponse.locals?.buildingId,
                    name: mockResponse.locals?.buildingName
                }
            });
        });
    });
});
