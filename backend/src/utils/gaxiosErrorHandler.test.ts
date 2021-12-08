import { Request, Response } from 'express';
import {
    badRequest,
    internalServerError,
    unauthorized,
    notFound
} from './responses';
import { gaxiosErrorHandler } from './gaxiosErrorHandler';
import { GaxiosError, GaxiosResponse } from 'gaxios';
import { mocked } from 'ts-jest/utils';

jest.mock('gaxios');
jest.mock('./responses');

const mockedBadRequest = mocked(badRequest, false);
const mockedInternalServerError = mocked(internalServerError, false);
const mockedUnauthorized = mocked(unauthorized, false);
const mockedNotFound = mocked(notFound, false);

describe('gaxiosErrorHandler', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;
    const gaxiosResponse: Partial<GaxiosResponse> = {};
    const error: Partial<GaxiosError> = new GaxiosError(
        '',
        {},
        gaxiosResponse as GaxiosResponse
    );

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {};
        mockNext = jest.fn();

        jest.resetAllMocks();
    });

    test('Should call next with error when it is not a GaxiosError', async () => {
        const err = new Error('non GaxiosError');

        await gaxiosErrorHandler()(
            err,
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toHaveBeenCalledWith(err);
    });

    test('Should return Bad Request when error message is "Invalid Input: Filter"', async () => {
        error.message = 'Invalid Input: Filter';

        await gaxiosErrorHandler()(
            error as GaxiosError,
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockedBadRequest).toHaveBeenCalledTimes(1);
        expect(mockNext).not.toHaveBeenCalled();
    });

    test('Should return Unauthorized when error message is "Invalid Credentials"', async () => {
        error.message = 'Invalid Credentials';

        await gaxiosErrorHandler()(
            error as GaxiosError,
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockedUnauthorized).toHaveBeenCalledTimes(1);
        expect(mockNext).not.toHaveBeenCalled();
    });

    test('Should return Unauthorized when error message is "invalid_grant"', async () => {
        error.message = 'invalid_grant';

        await gaxiosErrorHandler()(
            error as GaxiosError,
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockedUnauthorized).toHaveBeenCalledTimes(1);
        expect(mockNext).not.toHaveBeenCalled();
    });

    test('Should return Not Found when error message is "Resource has been deleted"', async () => {
        error.message = 'Resource has been deleted';

        await gaxiosErrorHandler()(
            error as GaxiosError,
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockedNotFound).toHaveBeenCalledTimes(1);
        expect(mockNext).not.toHaveBeenCalled();
    });

    test('Should return Not Found when error message is "Not Found"', async () => {
        error.message = 'Not Found';

        await gaxiosErrorHandler()(
            error as GaxiosError,
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockedNotFound).toHaveBeenCalledTimes(1);
        expect(mockNext).not.toHaveBeenCalled();
    });

    test('Should return Internal Server Error when error message is something else', async () => {
        error.message = 'Something else :D';

        await gaxiosErrorHandler()(
            error as GaxiosError,
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockedInternalServerError).toHaveBeenCalledTimes(1);
        expect(mockNext).not.toHaveBeenCalled();
    });
});
