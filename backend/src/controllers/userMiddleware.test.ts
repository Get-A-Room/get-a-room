import { createUserMiddleware } from './userMiddleware';
import { Request, Response } from 'express';
import {
    createUserFromTokenPayload,
    getUserWithSubject
} from './userController';
import { mocked } from 'ts-jest/utils';

const TEST_TOKEN_PAYLOAD = { sub: 'sub' };

jest.mock('./userController');
const mockedCreateUser = mocked(createUserFromTokenPayload, false);
const mockedGetUserWithSubject = mocked(getUserWithSubject, false);

describe('createUserIfNotFound', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            locals: {
                payload: TEST_TOKEN_PAYLOAD
            }
        };
        mockNext = jest.fn();

        jest.resetAllMocks();
    });

    test('Should throw an error when token payload is missing from res.locals', () => {
        mockResponse.locals = {
            payload: undefined
        };

        expect(() =>
            createUserMiddleware()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            )
        ).toThrow('payload');
    });

    test('Should create user if no user was found for sub', async () => {
        mockedGetUserWithSubject.mockResolvedValueOnce(null);

        await createUserMiddleware()(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );
        expect(mockedCreateUser).toBeCalledWith(TEST_TOKEN_PAYLOAD);
        expect(mockNext).toBeCalledWith();
    });

    test('Should not create user if one was found', async () => {
        mockedGetUserWithSubject.mockResolvedValueOnce({
            subject: 'sub',
            preferences: {}
        });

        await createUserMiddleware()(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );
        expect(mockedCreateUser).not.toBeCalled();
        expect(mockNext).toBeCalledWith();
    });

    test('Should call next with the error if an error was thrown on user creation', async () => {
        mockedGetUserWithSubject.mockResolvedValueOnce(null);

        const error = new Error('Saving user failed');
        mockedCreateUser.mockRejectedValueOnce(error);

        await createUserMiddleware()(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockNext).toBeCalledWith(error);
    });
});
