import { Request, Response } from 'express';
import { mocked } from 'ts-jest/utils';
import * as schema from '../../utils/googleSchema';
import { DateTime } from 'luxon';
import { badRequest, custom, internalServerError } from '../../utils/responses';
import { query } from 'express-validator';
import {
    makeBooking,
    validateInput,
    removeDeclinedEvent,
    simplifyEventData,
    checkRoomAccepted
} from './makeBookingController';
import {
    createEvent,
    deleteEvent,
    getEventData
} from '../googleAPI/calendarAPI';

jest.mock('../../utils/responses');
jest.mock('../googleAPI/calendarAPI');

const mockedCreateEvent = mocked(createEvent, false);
const mockedDeleteEvent = mocked(deleteEvent, false);
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

    describe('simplifyEventData', () => {
        const TEST_EVENTDATA: schema.EventData = {
            id: 'test id',
            start: {
                dateTime: DateTime.local().toISO()
            },
            end: {
                dateTime: DateTime.local().plus({ minutes: 60 }).toISO()
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
            expect(locals?.event.room).toHaveProperty('id', 'test room');
        });

        test('Should throw error if roomId property is missing', async () => {
            if (mockResponse.locals) {
                mockResponse.locals.roomId = undefined;
            }

            await simplifyEventData()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalled();
            expect(mockNext.mock.calls[0].length).toBe(1);
        });

        test('Should throw error if start or end are missing', async () => {
            if (mockResponse.locals) {
                mockResponse.locals.event.start = undefined;
                mockResponse.locals.event.end = undefined;
            }

            await simplifyEventData()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalled();
            expect(mockNext.mock.calls[0].length).toBe(1);
        });
    });
});
