import { Request, Response } from 'express';
import { getBuildings, getBuildingsMiddleware } from './buildingsController';
import { mocked } from 'ts-jest/utils';
import { getBuildingData } from './googleAPI/adminAPI';
import { internalServerError } from '../utils/responses';
import { OAuth2Client } from 'google-auth-library';

jest.mock('../utils/responses');
jest.mock('./googleAPI/adminAPI');

const mockedGetBuildingData = mocked(getBuildingData, false);
const mockedInternalServerError = mocked(internalServerError, false);

describe('buildingsController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    describe('getBuildingsMiddleware', () => {
        beforeEach(() => {
            mockRequest = {};
            mockResponse = {
                locals: {
                    oAuthClient: 'client'
                }
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should set data to res.locals.buildings', async () => {
            mockedGetBuildingData.mockResolvedValueOnce([
                {
                    buildingId: '1',
                    buildingName: 'First'
                },
                {
                    buildingId: '2',
                    buildingName: 'Second'
                }
            ]);

            await getBuildingsMiddleware()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            const locals = mockResponse.locals;
            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockedGetBuildingData).toBeCalledTimes(1);
            expect(locals?.buildings.length).toEqual(2);
        });

        test('Should return 500 when no buildings found', async () => {
            mockedGetBuildingData.mockResolvedValueOnce([]);

            await getBuildingsMiddleware()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedGetBuildingData).toBeCalledTimes(1);
            expect(mockedInternalServerError).toBeCalledTimes(1);
            expect(mockedInternalServerError).toBeCalledWith(
                mockRequest,
                mockResponse
            );
        });
    });
    describe('getBuildings', () => {
        const client: Partial<OAuth2Client> = {};

        beforeEach(() => {
            jest.resetAllMocks();
        });

        test('Should return building data', async () => {
            mockedGetBuildingData.mockResolvedValueOnce([
                {
                    buildingId: '1',
                    buildingName: 'First'
                },
                {
                    buildingId: '2',
                    buildingName: 'Second'
                }
            ]);

            const res = await getBuildings(client as OAuth2Client);

            expect(mockedGetBuildingData).toBeCalledTimes(1);
            expect(mockedGetBuildingData).toBeCalledWith(client);
            expect(res.length).toEqual(2);
        });

        test('Should return empty array when no buildings found', async () => {
            mockedGetBuildingData.mockResolvedValueOnce([]);

            const res = await getBuildings(client as OAuth2Client);

            expect(mockedGetBuildingData).toBeCalledTimes(1);
            expect(mockedGetBuildingData).toBeCalledWith(client);
            expect(res).toEqual([]);
        });
    });
});
