import { Request, Response } from 'express';
import { mocked } from 'ts-jest/utils';
import { badRequest, custom, internalServerError } from '../../utils/responses';
import { DateTime } from 'luxon';
import {
    addTimeToBooking,
    checkRoomIsFree,
    rollBackDeclinedUpdate
} from './updateBookingController';
import { freeBusyQuery, updateEndTime } from '../googleAPI/calendarAPI';

jest.mock('../../utils/responses');
jest.mock('../googleAPI/calendarAPI');

const mockedFreeBusyQuery = mocked(freeBusyQuery, false);
const mockedUpdateEndTime = mocked(updateEndTime, false);

const mockedBadRequest = mocked(badRequest, false);
const mockedCustomResponse = mocked(custom, false);
const mockedInternalServerError = mocked(internalServerError, false);

describe('updateBookingController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    describe('addTimeToBooking', () => {
        beforeEach(() => {
            mockRequest = {
                params: {
                    bookingId: 'XfzhT70FIg4CAbN1OYaK0Znxdc'
                },
                body: {
                    timeToAdd: 15
                }
            };
            mockResponse = {
                locals: {
                    oAuthClient: 'client',
                    event: {
                        end: {
                            dateTime: DateTime.now().toUTC().toISO()
                        }
                    },
                    roomId: 'roomId'
                }
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should return Bad request when bookingId length is invalid', async () => {
            mockRequest.params = {
                bookingId: 'XXXX'
            };

            await addTimeToBooking()(
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

            await addTimeToBooking()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedBadRequest).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalled();
        });

        test('Should set updated event to locals', async () => {
            mockedUpdateEndTime.mockResolvedValueOnce({
                id: 'testId'
            });

            await addTimeToBooking()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.locals?.event.id).toEqual('testId');
            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
        });
    });

    describe('checkRoomIsFree', () => {
        beforeEach(() => {
            mockRequest = {
                params: {
                    bookingId: 'XfzhT70FIg4CAbN1OYaK0Znxdc'
                },
                body: {
                    timeToAdd: 15
                }
            };
            mockResponse = {
                locals: {
                    oAuthClient: 'client',
                    event: {
                        end: {
                            dateTime: DateTime.now().toUTC().toISO()
                        }
                    },
                    roomId: 'room'
                }
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should return Internal server error when no query results', async () => {
            mockedFreeBusyQuery.mockResolvedValueOnce({});

            await checkRoomIsFree()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedInternalServerError).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalled();
        });

        test('Should return Conflict when there is event overlap', async () => {
            mockedFreeBusyQuery.mockResolvedValueOnce({
                room: DateTime.now().toUTC().toISO()
            });

            await checkRoomIsFree()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedCustomResponse).toBeCalledTimes(1);
            expect(mockedInternalServerError).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
        });

        test('Should call next when successful and room is free', async () => {
            mockedFreeBusyQuery.mockResolvedValueOnce({
                room: DateTime.now().plus({ minutes: 15 }).toUTC().toISO()
            });

            await checkRoomIsFree()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedCustomResponse).not.toBeCalled();
            expect(mockedInternalServerError).not.toBeCalled();
            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
        });
    });

    describe('rollBackDeclinedUpdate', () => {
        beforeEach(() => {
            mockRequest = {
                params: {
                    bookingId: 'XfzhT70FIg4CAbN1OYaK0Znxdc'
                },
                body: {
                    timeToAdd: 15
                }
            };
            mockResponse = {
                locals: {
                    oAuthClient: 'client',
                    event: {
                        end: {
                            dateTime: DateTime.now().toUTC().toISO()
                        }
                    },
                    roomId: 'room',
                    roomAccepted: false
                }
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should call next immediately if roomAccepted', async () => {
            if (mockResponse.locals) {
                mockResponse.locals.roomAccepted = true;
            }

            await rollBackDeclinedUpdate()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockedUpdateEndTime).not.toBeCalled();
        });

        test('Should return Conflict when successful', async () => {
            mockedUpdateEndTime.mockResolvedValueOnce({});

            await rollBackDeclinedUpdate()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalled();
            expect(mockedUpdateEndTime).toBeCalledTimes(1);
            expect(mockedCustomResponse).toBeCalledTimes(1);
        });
    });
});
