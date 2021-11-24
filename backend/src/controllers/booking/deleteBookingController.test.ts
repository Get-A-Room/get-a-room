import { Request, Response } from 'express';
import { mocked } from 'ts-jest/utils';
import { badRequest, internalServerError } from '../../utils/responses';
import { deleteEvent } from '../googleAPI/calendarAPI';
import { deleteBooking } from './deleteBookingController';

jest.mock('../../utils/responses');
jest.mock('../googleAPI/calendarAPI');
jest.mock('../googleAPI/adminAPI');

const mockedDeleteEvent = mocked(deleteEvent, false);
const mockedBadRequest = mocked(badRequest, false);
const mockedInternalServerError = mocked(internalServerError, false);

describe('deleteBookingController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    describe('deleteBooking', () => {
        test('Should return bad request because bookingId lenght is invalid', async () => {
            mockRequest = {
                params: {
                    bookingId: 'XXXX'
                }
            };

            mockResponse = {
                locals: {
                    oAuthClient: 'client'
                }
            };

            mockedDeleteEvent.mockImplementation();

            mockNext = jest.fn();

            jest.resetAllMocks();

            await deleteBooking()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedDeleteEvent).toBeCalledTimes(0);
            expect(mockedBadRequest).toBeCalledWith(mockRequest, mockResponse);
        });

        test('Should delete booking with valid bookingId', async () => {
            mockRequest = {
                params: {
                    bookingId: 'a7fiofhfgdio4938YYYYYXXXXX'
                }
            };

            mockResponse = {
                locals: {
                    oAuthClient: 'client'
                }
            };

            mockedDeleteEvent.mockImplementation();

            mockNext = jest.fn();

            jest.resetAllMocks();

            await deleteBooking()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalled();
            expect(mockedDeleteEvent).toBeCalledTimes(1);
            expect(mockedBadRequest).not.toBeCalledWith(
                mockRequest,
                mockResponse
            );
            expect(mockedInternalServerError).not.toBeCalledWith(
                mockRequest,
                mockResponse
            );
        });
    });
});
