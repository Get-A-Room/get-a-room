import { getPreferences } from './preferencesController';
import { Request, Response } from 'express';
import { getUserWithSubject } from './userController';
import { badRequest, internalServerError } from '../utils/responses';
import { mocked } from 'ts-jest/utils';

jest.mock('../utils/responses');
jest.mock('./userController');
const mockedGetUserWithSubject = mocked(getUserWithSubject, false);
const mockedBadRequest = mocked(badRequest, false);
const mockedInternalServerError = mocked(internalServerError, false);

describe('preferencesController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

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
            buildingName: 'building',
            buildingId: 'id',
            floorNames: ['1'],
            description: 'desc'
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
