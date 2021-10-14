import { createUserMiddleware } from './userMiddleware';
import { Request, Response } from 'express';
import { createUser, getUserWithSubject } from './userController';
import { mocked } from 'ts-jest/utils';

const TEST_SUB = 'sub';
const TEST_REFRESH_TOKEN = 'refreshToken';

jest.mock('./userController');
describe('createUserIfNotFound', () => {
    const mockedCreateUser = mocked(createUser, false);
    const mockedGetUserWithSubject = mocked(getUserWithSubject, false);

    let mockRequest: Partial<Request> = {};
    let mockResponse: Partial<Response> = {};
    let mockNext = jest.fn();

    beforeEach(() => {
        mockResponse.locals = {
            sub: TEST_SUB,
            refreshToken: TEST_REFRESH_TOKEN
        };
        jest.resetAllMocks();
    });

    test('Should create user if no user was found for sub', async () => {
        mockedGetUserWithSubject.mockResolvedValueOnce(null);

        await createUserMiddleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );
        expect(mockedCreateUser).toBeCalledWith(TEST_SUB, TEST_REFRESH_TOKEN);
        expect(mockNext).toBeCalledWith();
    });

    test('Should not create user if one was found', async () => {
        mockedGetUserWithSubject.mockResolvedValueOnce({
            subject: 'sub',
            preferences: {}
        });

        await createUserMiddleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );
        expect(mockedCreateUser).not.toBeCalled();
        expect(mockNext).toBeCalledWith();
    });

    test('Should do something when creating an user fails', async () => {
        mockedGetUserWithSubject.mockResolvedValueOnce(null);

        const error = new Error('Saving user failed');
        mockedCreateUser.mockRejectedValueOnce(error);

        await createUserMiddleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockNext).toBeCalledWith(error);
    });
});
