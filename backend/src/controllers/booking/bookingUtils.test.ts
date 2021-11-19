import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import { mocked } from 'ts-jest/utils';
import { internalServerError } from '../../utils/responses';
import { getSingleRoomData } from '../googleAPI/adminAPI';
import { simplifySingleRoomData } from '../roomController';
import { simplifyEventData } from './bookingUtils';
import * as schema from '../../utils/googleSchema';
import RoomData from '../../types/roomData';

jest.mock('../roomController');
jest.mock('../googleAPI/adminAPI');
jest.mock('../../utils/responses');

const mockedInternalServerError = mocked(internalServerError, false);
const mockedGetSingleRoomData = mocked(getSingleRoomData, false);
const mockedSimplifySingleRoomData = mocked(simplifySingleRoomData, false);

const MOCK_ROOM_DATA: RoomData = {
    id: 'roomID',
    name: 'room name',
    capacity: 12,
    building: 'test building',
    floor: '1',
    features: [],
    nextCalendarEvent: '-1',
    location: 'location'
};

describe('bookingUtils', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    describe('simplifyEventData', () => {
        const TEST_EVENTDATA: schema.EventData = {
            id: 'test id',
            start: {
                dateTime: DateTime.now().toUTC().toISO()
            },
            end: {
                dateTime: DateTime.now().toUTC().plus({ minutes: 60 }).toISO()
            }
        };

        beforeEach(() => {
            mockRequest = {};
            mockResponse = {
                locals: {
                    event: TEST_EVENTDATA,
                    roomId: 'test room'
                }
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should simplify data', async () => {
            mockedGetSingleRoomData.mockResolvedValueOnce({});
            mockedSimplifySingleRoomData.mockReturnValueOnce(MOCK_ROOM_DATA);

            await simplifyEventData()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            const locals = mockResponse.locals;
            expect(mockNext).toBeCalledWith();
            expect(locals).toHaveProperty('event');
            expect(locals?.event).toHaveProperty('id', TEST_EVENTDATA.id);
            expect(locals?.event).toHaveProperty(
                'startTime',
                TEST_EVENTDATA.start?.dateTime
            );
            expect(locals?.event).toHaveProperty(
                'endTime',
                TEST_EVENTDATA.end?.dateTime
            );
            expect(locals?.event.room).toEqual(MOCK_ROOM_DATA);
        });

        test('Should return internal server error if roomId property is missing', async () => {
            if (mockResponse.locals) {
                mockResponse.locals.roomId = undefined;
            }

            await simplifyEventData()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedInternalServerError).toBeCalledTimes(1);
            expect(mockedGetSingleRoomData).not.toBeCalled();
            expect(mockedSimplifySingleRoomData).not.toBeCalled();
        });

        test('Should return internal server error if start or end are missing', async () => {
            if (mockResponse.locals) {
                mockResponse.locals.event.start = undefined;
                mockResponse.locals.event.end = undefined;
            }

            mockedGetSingleRoomData.mockResolvedValueOnce({});
            mockedSimplifySingleRoomData.mockReturnValueOnce(MOCK_ROOM_DATA);

            await simplifyEventData()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedGetSingleRoomData).toBeCalledTimes(1);
            expect(mockedSimplifySingleRoomData).toBeCalledTimes(1);
            expect(mockedInternalServerError).toBeCalledTimes(1);
        });
    });
});
