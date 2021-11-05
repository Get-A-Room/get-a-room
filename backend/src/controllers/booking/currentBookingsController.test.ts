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

describe('currentBookingsController', () => {
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
});
