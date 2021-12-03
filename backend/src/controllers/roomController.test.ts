import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { mocked } from 'ts-jest/utils';
import {
    addAllRooms,
    fetchAvailability,
    removeReservedRooms,
    simplifyRoomData,
    simplifySingleRoomData,
    writeReservationData
} from './roomController';
import { badRequest, noContent } from '../utils/responses';
import { getRoomData } from './googleAPI/adminAPI';
import { freeBusyQuery } from './googleAPI/calendarAPI';
import { GaxiosError, GaxiosResponse } from 'gaxios';
import RoomData from '../types/roomData';
import { DateTime } from 'luxon';

jest.mock('gaxios');
jest.mock('google-auth-library');
jest.mock('./buildingsController');
jest.mock('./googleAPI/adminAPI');
jest.mock('./googleAPI/calendarAPI');
jest.mock('../utils/responses');

const mockedBadRequest = mocked(badRequest, false);
const mockedNoContent = mocked(noContent, false);
const mockedGetRoomData = mocked(getRoomData, false);
const mockedFreeQuery = mocked(freeBusyQuery, false);

describe('roomController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    describe('addAllRooms', () => {
        beforeEach(() => {
            mockRequest = {
                query: {}
            };
            mockResponse = {
                locals: {
                    oAuthClient: new OAuth2Client()
                }
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should return no content if no rooms found', async () => {
            mockRequest.query = {
                building: 'testBuilding'
            };

            mockedGetRoomData.mockResolvedValueOnce([]);

            await addAllRooms()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedNoContent).toHaveBeenCalledTimes(1);
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('Should set rooms to locals', async () => {
            mockedGetRoomData.mockResolvedValueOnce([
                {
                    resourceId: 'id1',
                    resourceName: 'room1',
                    resourceEmail: 'room1@test.com',
                    capacity: 10,
                    buildingId: 'building1',
                    floorName: '2',
                    generatedResourceName: 'room1-building1',
                    featureInstances: [
                        {
                            feature: {
                                name: 'feature1'
                            }
                        },
                        {
                            feature: {
                                name: 'feature2'
                            }
                        }
                    ]
                }
            ]);

            const roomData: RoomData[] = [
                {
                    id: 'room1@test.com',
                    name: 'room1',
                    capacity: 10,
                    building: 'building1',
                    floor: '2',
                    features: ['feature1', 'feature2'],
                    nextCalendarEvent: '-1',
                    location: 'room1-building1'
                }
            ];

            await addAllRooms()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.locals?.rooms).toEqual(roomData);
            expect(mockedNoContent).not.toHaveBeenCalled();
            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith();
        });

        test('Should handle GaxiosError', async () => {
            // Thrown when given building not found from results
            const err = new GaxiosError(
                'Invalid Input: Filter',
                {},
                {} as GaxiosResponse
            );

            mockedGetRoomData.mockImplementationOnce(async () => {
                throw err;
            });

            await addAllRooms()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(err);
        });

        test('Should handle normal error', async () => {
            // Thrown when Google API responds with unusual response
            const err = new Error('Could not get rooms');

            mockedGetRoomData.mockImplementationOnce(async () => {
                throw err;
            });

            await addAllRooms()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(err);
        });
    });

    describe('fetchAvailability', () => {
        beforeEach(() => {
            mockRequest = {
                query: {}
            };
            mockResponse = {
                locals: {
                    oAuthClient: new OAuth2Client(),
                    rooms: [
                        {
                            id: 'test1@test.com',
                            name: 'Test 1',
                            capacity: 10,
                            building: 'testBuilding',
                            floor: '1',
                            features: ['TV'],
                            nextCalendarEvent: '-1',
                            location: 'Test 1 - testBuilding'
                        },
                        {
                            id: 'test2@test.com',
                            name: 'Test 2',
                            capacity: 23,
                            building: 'testBuilding',
                            floor: '2',
                            features: ['TV'],
                            nextCalendarEvent: '-1',
                            location: 'Test 2 - testBuilding'
                        }
                    ]
                }
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should set empty object to locals if no rooms given', async () => {
            if (mockResponse.locals) {
                mockResponse.locals.rooms = [];
            }

            await fetchAvailability()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.locals?.roomReservations).toEqual({});
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith();
        });

        test('Should set roomReservations to locals', async () => {
            mockRequest.query = {
                until: DateTime.now().plus({ hours: 1 }).toUTC().toISO()
            };

            const reservations = {
                'test1@test.com': 'ISO time',
                'test2@test.com': 'ISO time'
            };

            mockedFreeQuery.mockResolvedValueOnce(reservations);

            await fetchAvailability()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.locals?.roomReservations).toEqual(reservations);
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith();
        });

        test('Should return Bad Request if end is before start', async () => {
            mockRequest.query = {
                until: DateTime.now().minus({ hours: 1 }).toUTC().toISO()
            };

            await fetchAvailability()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedBadRequest).toHaveBeenCalledTimes(1);
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('Should handle errors thrown by freeBusyQuery', async () => {
            const err = new Error('test error');

            mockedFreeQuery.mockImplementationOnce(async () => {
                throw err;
            });

            await fetchAvailability()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(err);
        });
    });

    describe('writeReservationData', () => {
        beforeEach(() => {
            mockRequest = {
                query: {}
            };
            mockResponse = {
                locals: {
                    oAuthClient: new OAuth2Client(),
                    rooms: [
                        {
                            id: 'test1@test.com',
                            name: 'Test 1',
                            capacity: 10,
                            building: 'testBuilding',
                            floor: '1',
                            features: ['TV'],
                            nextCalendarEvent: '-1',
                            location: 'Test 1 - testBuilding'
                        },
                        {
                            id: 'test2@test.com',
                            name: 'Test 2',
                            capacity: 23,
                            building: 'testBuilding',
                            floor: '2',
                            features: ['TV'],
                            nextCalendarEvent: '-1',
                            location: 'Test 2 - testBuilding'
                        }
                    ],
                    roomReservations: {
                        'test1@test.com': 'event-test1',
                        'test2@test.com': 'event-test2'
                    }
                }
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should combine reservation data with rooms', async () => {
            await writeReservationData()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.locals?.rooms[0].nextCalendarEvent).toEqual(
                'event-test1'
            );
            expect(mockResponse.locals?.rooms[1].nextCalendarEvent).toEqual(
                'event-test2'
            );
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith();
        });

        test('Should handle no rooms given', async () => {
            if (mockResponse.locals) {
                mockResponse.locals.rooms = [];
            }

            await writeReservationData()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.locals?.rooms).toEqual([]);
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith();
        });
    });

    describe('removeReservedRooms', () => {
        beforeEach(() => {
            mockRequest = {
                query: {}
            };
            mockResponse = {
                locals: {
                    oAuthClient: new OAuth2Client(),
                    rooms: [
                        {
                            id: 'test1@test.com',
                            name: 'Test 1',
                            capacity: 10,
                            building: 'testBuilding',
                            floor: '1',
                            features: ['TV'],
                            nextCalendarEvent: DateTime.now()
                                .plus({ hours: 3 })
                                .toUTC()
                                .toISO(),
                            location: 'Test 1 - testBuilding'
                        },
                        {
                            id: 'test2@test.com',
                            name: 'Test 2',
                            capacity: 23,
                            building: 'testBuilding',
                            floor: '2',
                            features: ['TV'],
                            nextCalendarEvent: DateTime.now()
                                .plus({ minutes: 15 })
                                .toUTC()
                                .toISO(),
                            location: 'Test 2 - testBuilding'
                        }
                    ]
                }
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should skip if showReserved true', async () => {
            mockRequest.query = {
                showReserved: 'true'
            };

            await removeReservedRooms()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith();
        });

        test('Should support empty rooms array', async () => {
            if (mockResponse.locals) {
                mockResponse.locals.rooms = [];
            }

            await removeReservedRooms()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith();
        });

        test('Should remove rooms that have less than 30 minutes free', async () => {
            await removeReservedRooms()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            // Second room should have been removed
            expect(mockResponse.locals?.rooms.length).toEqual(1);
            expect(mockResponse.locals?.rooms[0].id).toEqual('test1@test.com');
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith();
        });
    });

    describe('simplifyRoomData', () => {
        test('Should support empty array', () => {
            const res = simplifyRoomData([]);
            expect(res).toEqual([]);
        });
    });

    describe('simplifySingleRoomData', () => {
        const roomData = {
            resourceId: 'id1',
            resourceName: 'room1',
            resourceEmail: 'room1@test.com',
            capacity: 10,
            buildingId: 'building1',
            floorName: '2',
            generatedResourceName: 'room1-building1',
            featureInstances: [
                {
                    feature: {
                        name: 'feature1'
                    }
                },
                {
                    feature: {
                        name: 'feature2'
                    }
                }
            ]
        };

        const simplified = {
            id: 'room1@test.com',
            name: 'room1',
            capacity: 10,
            building: 'building1',
            floor: '2',
            features: ['feature1', 'feature2'],
            nextCalendarEvent: '-1',
            location: 'room1-building1'
        };

        beforeEach(() => {
            mockRequest = {
                query: {}
            };
            mockResponse = {
                locals: {
                    oAuthClient: new OAuth2Client()
                }
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should simplify room data', () => {
            const res = simplifySingleRoomData(roomData);
            expect(res).toEqual(simplified);
        });

        test('Should support empty features array', () => {
            const data = roomData;
            data.featureInstances = [];

            const simplifiedData = simplified;
            simplifiedData.features = [];

            const res = simplifySingleRoomData(data);

            expect(res).toEqual(simplifiedData);
        });
    });
});
