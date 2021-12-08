import { Request, Response } from 'express';
import { mocked } from 'ts-jest/utils';
import { badRequest, custom, internalServerError } from '../../utils/responses';
import { query } from 'express-validator';
import { DateTime } from 'luxon';
import {
    makeBooking,
    validateInput,
    removeDeclinedEvent,
    checkRoomAccepted,
    checkRoomIsFree
} from './makeBookingController';
import {
    createEvent,
    deleteEvent,
    freeBusyQuery,
    getEventData
} from '../googleAPI/calendarAPI';

jest.mock('../../utils/responses');
jest.mock('../googleAPI/calendarAPI');

const mockedCreateEvent = mocked(createEvent, false);
const mockedDeleteEvent = mocked(deleteEvent, false);
const mockedFreeBusyQuery = mocked(freeBusyQuery, false);
const mockedGetEventData = mocked(getEventData, false);

const mockedBadRequest = mocked(badRequest, false);
const mockedCustomResponse = mocked(custom, false);
const mockedInternalServerError = mocked(internalServerError, false);

describe('makeBookingController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    describe('validateInput', () => {
        const VALIDATEINPUT_BODY_PAYLOAD = {
            roomId: 'testroom@oispahuone.com',
            title: 'Test reservation',
            duration: 60
        };

        beforeEach(() => {
            mockRequest = {
                body: VALIDATEINPUT_BODY_PAYLOAD
            };
            mockResponse = { locals: {} };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should set values to res.locals', async () => {
            await validateInput()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            const locals = mockResponse.locals;
            expect(mockNext).toBeCalledWith();
            expect(locals?.roomId).toEqual(VALIDATEINPUT_BODY_PAYLOAD.roomId);
            expect(locals?.title).toEqual(VALIDATEINPUT_BODY_PAYLOAD.title);
            expect(locals?.duration).toEqual(
                VALIDATEINPUT_BODY_PAYLOAD.duration
            );
        });

        test('Should return bad request if roomId missing', async () => {
            mockRequest.body.roomId = undefined;

            await validateInput()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalledWith();
            expect(mockedBadRequest).toBeCalledWith(mockRequest, mockResponse);
        });

        test('Should return bad request if title is missing', async () => {
            mockRequest.body.title = undefined;

            await validateInput()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalledWith();
            expect(mockedBadRequest).toBeCalledWith(mockRequest, mockResponse);
        });

        test('Should return bad request if duration is missing', async () => {
            mockRequest.body.duration = undefined;

            await validateInput()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalledWith();
            expect(mockedBadRequest).toBeCalledWith(mockRequest, mockResponse);
        });

        test('Should return bad request if duration is not a integer', async () => {
            mockRequest.body.duration = 'not number';

            await validateInput()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).not.toBeCalledWith();
            expect(mockedBadRequest).toBeCalledWith(mockRequest, mockResponse);
        });
    });

    describe('makeBooking', () => {
        beforeEach(() => {
            mockRequest = {
                body: {
                    duration: 60
                }
            };
            mockResponse = {
                locals: {
                    oAuthClient: 'client',
                    roomId: 'test room',
                    email: 'test@oispahuone.com',
                    title: 'Test title'
                }
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should call createEvent', async () => {
            mockedCreateEvent.mockResolvedValueOnce({
                id: '00111010 00101001'
            });

            await makeBooking()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedCreateEvent).toBeCalledTimes(1);
            expect(mockedInternalServerError).not.toBeCalled();
            expect(mockNext).toBeCalledWith();
        });

        test('Should respond with internal server error if response contain no id', async () => {
            mockedCreateEvent.mockResolvedValueOnce({
                id: undefined
            });

            await makeBooking()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedCreateEvent).toBeCalledTimes(1);
            expect(mockedInternalServerError).toBeCalledWith(
                mockRequest,
                mockResponse
            );
            expect(mockNext).not.toBeCalled();
        });
    });

    describe('checkRoomIsFree', () => {
        beforeEach(() => {
            mockRequest = {};
            mockResponse = {
                locals: {
                    oAuthClient: 'client',
                    roomId: 'room',
                    duration: 60
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
                room: DateTime.now().plus({ minutes: 60 }).toUTC().toISO()
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

    describe('checkRoomAccepted', () => {
        beforeEach(() => {
            mockRequest = {
                query: {},
                body: {
                    duration: 60
                }
            };
            mockResponse = {
                locals: {
                    oAuthClient: 'client',
                    roomId: 'room@oispahuone.com',
                    eventId: 'event Id'
                }
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should call next if noConfirmation is true', async () => {
            mockRequest.query = {
                noConfirmation: 'true'
            };

            await query('noConfirmation').toBoolean().run(mockRequest);
            await checkRoomAccepted()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockedGetEventData).not.toBeCalled();
        });

        test('Should return after 8 failed tries', async () => {
            mockedGetEventData.mockResolvedValue({
                attendees: [
                    {
                        email: mockResponse.locals?.roomId,
                        responseStatus: 'needsAction'
                    }
                ]
            });

            await checkRoomAccepted()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockResponse.locals?.roomAccepted).toEqual(false);
        });

        test('Should fail if room not in attendees', async () => {
            mockedGetEventData.mockResolvedValue({
                attendees: [
                    {
                        email: 'not.roomId@oispahuone.com',
                        responseStatus: 'needsAction'
                    }
                ]
            });

            await checkRoomAccepted()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockResponse.locals?.roomAccepted).toEqual(false);
        });

        test('Should return if room accepted', async () => {
            mockedGetEventData
                .mockResolvedValue({
                    attendees: [
                        {
                            email: mockResponse.locals?.roomId,
                            responseStatus: 'accepted'
                        }
                    ]
                })
                .mockResolvedValueOnce({
                    attendees: [
                        {
                            email: mockResponse.locals?.roomId,
                            responseStatus: 'needsAction'
                        }
                    ]
                })
                .mockResolvedValueOnce({
                    attendees: [
                        {
                            email: mockResponse.locals?.roomId,
                            responseStatus: 'needsAction'
                        }
                    ]
                });

            await checkRoomAccepted()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockResponse.locals?.roomAccepted).toEqual(true);
        });

        test('Should return if room declined', async () => {
            mockedGetEventData
                .mockResolvedValue({
                    attendees: [
                        {
                            email: mockResponse.locals?.roomId,
                            responseStatus: 'declined'
                        }
                    ]
                })
                .mockResolvedValueOnce({
                    attendees: [
                        {
                            email: mockResponse.locals?.roomId,
                            responseStatus: 'needsAction'
                        }
                    ]
                });

            await checkRoomAccepted()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockResponse.locals?.roomAccepted).toEqual(false);
        });
    });

    describe('removeDeclinedEvent', () => {
        beforeEach(() => {
            mockRequest = { query: {} };
            mockResponse = {
                locals: {
                    oAuthClient: 'client',
                    roomAccepted: false,
                    eventId: 'id@oispahuone.com'
                }
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should call next if noConfirmation is true', async () => {
            mockRequest.query = {
                noConfirmation: 'true'
            };

            await query('noConfirmation').toBoolean().run(mockRequest);
            await removeDeclinedEvent()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockedDeleteEvent).not.toBeCalled();
            expect(mockedCustomResponse).not.toBeCalled();
        });

        test('Should call deleteEvent if roomAccepted is false and eventId defined', async () => {
            await removeDeclinedEvent()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            const locals = mockResponse.locals;
            expect(mockNext).not.toBeCalledWith();
            expect(mockedDeleteEvent).toBeCalledWith(
                mockResponse.locals?.oAuthClient,
                locals?.eventId
            );
            expect(mockedCustomResponse).toBeCalledWith(
                mockRequest,
                mockResponse,
                409,
                'Conflict'
            );
        });

        test('Should throw error if client is not defined', async () => {
            if (mockResponse.locals) {
                mockResponse.locals.oAuthClient = undefined;
            }

            await removeDeclinedEvent()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalled();
            expect(mockNext.mock.calls[0].length).toBe(1);
            expect(mockedDeleteEvent).not.toBeCalled();
            expect(mockedCustomResponse).not.toBeCalled();
        });

        test('Should call next if eventId is undefined', async () => {
            if (mockResponse.locals) {
                mockResponse.locals.eventId = undefined;
            }

            await removeDeclinedEvent()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledWith();
            expect(mockedDeleteEvent).not.toBeCalled();
            expect(mockedCustomResponse).not.toBeCalled();
        });
    });
});
