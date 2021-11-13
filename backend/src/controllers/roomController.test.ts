import { Request, Response } from 'express';
import { mocked } from 'ts-jest/utils';
import { getBuildings } from './buildingsController';
import { badRequest, internalServerError } from '../utils/responses';
import { freeBusyQuery } from './googleAPI/calendarAPI';
import {
    addAllRooms,
    fetchAvailability,
    writeReservationData
} from './roomController';

jest.mock('./buildingsController');
jest.mock('./googleAPI/calendarAPI');
jest.mock('../utils/responses');

const mockedGetBuildings = mocked(getBuildings, false);
const mockedFreeBusyQuery = mocked(freeBusyQuery, false);
const mockedBadRequest = mocked(badRequest, false);
const mockedInternalServerError = mocked(internalServerError, false);

describe('roomController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    describe('addAllRooms', () => {
        beforeEach(() => {
            mockRequest = {
                query: {
                    building: 'test1'
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

        test.todo('Should return no content if no rooms found');
        test.todo('Should return bad request if building not found');
        test.todo(
            'Should return internal server error in case of other errors'
        );
        test.todo('Should set rooms to locals');
    });

    describe('fetchAvailability', () => {
        beforeEach(() => {
            mockRequest = {};
            mockResponse = {
                locals: {
                    oAuthClient: 'client',
                    rooms: [
                        {
                            id: 'test1',
                            name: 'Test 1',
                            email: 'test1@oispahuone.com',
                            capacity: 10,
                            building: 'testBuilding',
                            floor: '1',
                            features: ['TV'],
                            nextCalendarEvent: null,
                            location: 'Herwood'
                        },
                        {
                            id: 'test2',
                            name: 'Test 2',
                            email: 'test2@oispahuone.com',
                            capacity: 23,
                            building: 'testBuilding',
                            floor: '2',
                            features: ['TV'],
                            nextCalendarEvent: null,
                            location: 'Herwood'
                        }
                    ]
                }
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test.todo(
            'Should set empty roomReservations to locals if no rooms given'
        );
        test.todo('Should set roomReservations to locals');
    });

    describe('writeReservationData', () => {
        beforeEach(() => {
            mockRequest = {};
            mockResponse = {
                locals: {
                    oAuthClient: 'client',
                    rooms: [
                        {
                            id: 'test1',
                            name: 'Test 1',
                            email: 'test1@oispahuone.com',
                            capacity: 10,
                            building: 'testBuilding',
                            floor: '1',
                            features: ['TV'],
                            nextCalendarEvent: null,
                            location: 'Herwood'
                        },
                        {
                            id: 'test2',
                            name: 'Test 2',
                            email: 'test2@oispahuone.com',
                            capacity: 23,
                            building: 'testBuilding',
                            floor: '2',
                            features: ['TV'],
                            nextCalendarEvent: null,
                            location: 'Herwood'
                        }
                    ]
                }
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test.todo('Should set room reservation data to room data');
    });
});
