import { Request, Response } from 'express';
import { mocked } from 'ts-jest/utils';
import * as schema from '../../utils/googleSchema';
import { DateTime } from 'luxon';
import { internalServerError } from '../../utils/responses';

import {
    getCurrentBookingsMiddleware,
    simplifyAndFilterCurrentBookingsMiddleware
} from './currentBookingsController';
import { getCurrentBookings } from '../googleAPI/calendarAPI';

import { getRoomData } from '../googleAPI/adminAPI';

jest.mock('../../utils/responses');
jest.mock('../googleAPI/calendarAPI');
jest.mock('../googleAPI/adminAPI');

const mockedGetCurrentBookings = mocked(getCurrentBookings, false);
const mockedGetRoomData = mocked(getRoomData, false);
const mockedInternalServerError = mocked(internalServerError, false);

describe('currentBookingsController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    describe('getCurrentBookingsMiddleware', () => {
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

        test('Should set data to res.locals.currentBookings', async () => {
            mockedGetCurrentBookings.mockResolvedValueOnce(
                allCurrentAndFutureBookings
            );

            await getCurrentBookingsMiddleware()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            const currentBookings: schema.EventsData =
                mockResponse?.locals?.currentBookings;

            expect(mockNext).toBeCalledWith();
            expect(mockedGetCurrentBookings).toBeCalledTimes(1);
            expect(currentBookings).not.toBeFalsy();
            expect(currentBookings.items).not.toBeUndefined();
            expect(currentBookings?.kind).toBe('calendar#events');
            expect(currentBookings?.items?.length).toBe(3);
        });

        test('Should respond with internal server error if response object is empty', async () => {
            mockedGetCurrentBookings.mockResolvedValueOnce({});

            await getCurrentBookingsMiddleware()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedGetCurrentBookings).toBeCalledTimes(1);
            expect(mockedInternalServerError).toBeCalledWith(
                mockRequest,
                mockResponse
            );
            expect(mockNext).not.toBeCalled();
        });
    });

    describe('simplifyAndFilterCurrentBookingsMiddleware', () => {
        test('Should simplify and filter current bookings correctly', async () => {
            mockRequest = {};
            mockResponse = {
                locals: {
                    oAuthClient: 'client',
                    currentBookings: allCurrentAndFutureBookings
                }
            };
            mockNext = jest.fn();
            jest.resetAllMocks();

            mockedGetRoomData.mockResolvedValueOnce(rooms);

            await simplifyAndFilterCurrentBookingsMiddleware()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            const currentBookings = mockResponse?.locals?.currentBookings;
            expect(currentBookings.length).toBe(1);
            expect(currentBookings[0].id).toBe('3pt0pdqmgp0c4qa8a7o4ie0an4');
            expect(currentBookings[0].room.id).toBe(
                'c_188dlqruaau34j82gd69abdo87gs6@resource.calendar.google.com'
            );
            expect(currentBookings[0].room.name).toBe('Höyhen');
            expect(currentBookings[0].room.building).toBe('Hakaniemi');
            expect(currentBookings[0].room.features).toEqual([
                'Internal Only',
                'Jabra',
                'TV'
            ]);
        });

        test('locals.currentBookings should be empty list if there is not any current or future bookings', async () => {
            mockRequest = {};
            mockResponse = {
                locals: {
                    oAuthClient: 'client',
                    currentBookings: { kind: 'calendar#events', items: [] }
                }
            };
            mockNext = jest.fn();

            jest.resetAllMocks();

            mockedGetRoomData.mockResolvedValueOnce(rooms);

            await simplifyAndFilterCurrentBookingsMiddleware()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            const currentBookings = mockResponse?.locals?.currentBookings;
            expect(currentBookings.length).toBe(0);
            expect(currentBookings).toEqual([]);
        });
    });
});

// Test mock data
const allCurrentAndFutureBookings: schema.EventsData = {
    kind: 'calendar#events',
    items: [
        {
            id: '1j17pp72bmld5an9abls35p298',
            location: 'Hermia 5-2-Namu-Sofas (10) [TV]',
            start: {
                dateTime: DateTime.now().toUTC().minus({ minutes: 61 }).toISO()
            },
            end: {
                dateTime: DateTime.now().toUTC().minus({ minutes: 1 }).toISO()
            }
        },
        {
            id: '3pt0pdqmgp0c4qa8a7o4ie0an4',
            location: 'Hakaniemi-7-Höyhen (4) [TV]',
            start: {
                dateTime: DateTime.now().toUTC().minus({ minutes: 30 }).toISO()
            },
            end: {
                dateTime: DateTime.now().toUTC().plus({ minutes: 30 }).toISO()
            }
        },
        {
            id: '1j17pp72bmld5dsksrpl5jewrt',
            location: 'Arkadia-4-Parlamentti (12) [TV]',
            start: {
                dateTime: DateTime.now().toUTC().plus({ minutes: 1 }).toISO()
            },
            end: {
                dateTime: DateTime.now().toUTC().plus({ minutes: 61 }).toISO()
            }
        }
    ]
};

// Test mock data
const rooms: schema.CalendarResource[] = [
    {
        resourceId: '85866896181',
        resourceName: 'Sofas',
        resourceEmail:
            'c_188dh3ujphp7ghn8l6udv5v0ilmqq@resource.calendar.google.com',
        generatedResourceName: 'Hermia 5-2-Namu-Sofas (10) [TV]',
        buildingId: 'Hermia 5',
        floorName: '2',
        featureInstances: [
            {
                feature: {
                    kind: 'admin#directory#resources#features#Feature',
                    etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/0ETa0Jg5wfrJFfrwF3W02f1Qnu4"',
                    name: 'Sofa'
                }
            }
        ]
    },
    {
        resourceId: '80430164898',
        resourceName: 'Höyhen',
        resourceEmail:
            'c_188dlqruaau34j82gd69abdo87gs6@resource.calendar.google.com',
        generatedResourceName: 'Hakaniemi-7-Höyhen (4) [TV]',
        buildingId: 'Hakaniemi',
        featureInstances: [
            {
                feature: {
                    kind: 'admin#directory#resources#features#Feature',
                    etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/srb_9oJRl1hmLTsFDyzMtyOxs5g"',
                    name: 'Internal Only'
                }
            },
            {
                feature: {
                    kind: 'admin#directory#resources#features#Feature',
                    etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/KWXPLAFpLHAOiS8NysrI-yn9bXk"',
                    name: 'Jabra'
                }
            },
            {
                feature: {
                    kind: 'admin#directory#resources#features#Feature',
                    etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/3AbY8PnGoFT8NrssnHU9wYAshAE"',
                    name: 'TV'
                }
            }
        ]
    },
    {
        resourceId: '9389184770',
        resourceName: 'Arkadia',
        resourceEmail:
            'c_188fib500s84uis7kcpb6dfm93v24@resource.calendar.google.com',
        generatedResourceName: 'Arkadia-4-Arkadia (6) [TV]',
        buildingId: 'Arkadia',
        featureInstances: [
            {
                feature: {
                    kind: 'admin#directory#resources#features#Feature',
                    etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/jbcrubBqGJ5DbyjOng7LCM77F6E"',
                    name: 'Whiteboard'
                }
            }
        ]
    },
    {
        resourceId: '1752049657',
        resourceName: 'Parlamentti',
        resourceEmail:
            'c_188beek3947jqia9kf9vjr24u8bkc@resource.calendar.google.com',
        generatedResourceName: 'Arkadia-4-Parlamentti (12) [TV]',
        buildingId: 'Arkadia',
        featureInstances: []
    }
];
