import { Request, Response } from 'express';
import { mocked } from 'ts-jest/utils';
import { badRequest } from '../../utils/responses';
import { getBooking } from './getBookingController';
import { getEventData } from '../googleAPI/calendarAPI';
import { EventData } from '../../utils/googleSchema';

jest.mock('../../utils/responses');
jest.mock('../googleAPI/calendarAPI');

const mockedGetEventData = mocked(getEventData, false);
const mockedBadRequest = mocked(badRequest, false);

describe('getBookingController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    describe('getBooking', () => {
        beforeEach(() => {
            mockRequest = {
                params: {
                    bookingId: 'XfzhT70FIg4CAbN1OYaK0Znxdc'
                }
            };
            mockResponse = {
                locals: {
                    oAuthClient: 'client'
                }
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should return Bad request when bookingId length is invalid', async () => {
            mockRequest.params = {
                bookingId: 'XXXX'
            };

            await getBooking()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedBadRequest).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalled();
        });

        test('Should return Bad request when bookingId does not exist', async () => {
            mockRequest.params = {
                bookingId: ''
            };

            await getBooking()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedBadRequest).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalled();
        });

        test('Should set event data to locals', async () => {
            const event: EventData = {
                id: 'eventId',
                attendees: [
                    {
                        email: 'client@test.com',
                        resource: false
                    },
                    {
                        email: 'room@test.com',
                        resource: true
                    }
                ]
            };

            mockedGetEventData.mockResolvedValueOnce(event);

            await getBooking()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.locals?.roomId).toEqual('room@test.com');
            expect(mockResponse.locals?.eventId).toEqual(
                mockRequest.params?.bookingId
            );
            expect(mockResponse.locals?.event).toEqual(event);

            expect(mockedBadRequest).not.toBeCalled();
            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
        });
    });
});
