// import { Request, Response } from 'express';
import {
    badRequest,
    unauthorized,
    invalidToken,
    forbidden,
    notFound,
    internalServerError,
    notImplemented,
    serviceUnavailable,
    custom
} from './responses';

/* eslint-disable @typescript-eslint/no-explicit-any*/
const mockRequest: any = () => {
    return {};
};
const mockResponse: any = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('responses', () => {
    let request: any;
    let response: any;

    test('Should return status 400 - Bad Request', () => {
        request = mockRequest();
        response = mockResponse();
        badRequest(request, response);

        expect(response.status).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledTimes(1);
        expect(response.json).toHaveBeenCalledWith({
            code: 400,
            message: 'Bad Request'
        });
    });

    test('Should return status 401 - Unauthorized', () => {
        request = mockRequest();
        response = mockResponse();
        unauthorized(request, response);

        expect(response.status).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledTimes(1);
        expect(response.json).toHaveBeenCalledWith({
            code: 401,
            message: 'Unauthorized'
        });
    });

    test('Should return status 401 - Invalid token', () => {
        request = mockRequest();
        response = mockResponse();
        invalidToken(request, response);

        expect(response.status).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledTimes(1);
        expect(response.json).toHaveBeenCalledWith({
            code: 401,
            message: 'Invalid Token'
        });
    });

    test('Should return status 403 - Forbidden', () => {
        request = mockRequest();
        response = mockResponse();
        forbidden(request, response);

        expect(response.status).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveBeenCalledWith(403);
        expect(response.json).toHaveBeenCalledTimes(1);
        expect(response.json).toHaveBeenCalledWith({
            code: 403,
            message: 'Forbidden'
        });
    });

    test('Should return status 404 - Not Found', () => {
        request = mockRequest();
        response = mockResponse();
        notFound(request, response);

        expect(response.status).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveBeenCalledWith(404);
        expect(response.json).toHaveBeenCalledTimes(1);
        expect(response.json).toHaveBeenCalledWith({
            code: 404,
            message: 'Not Found'
        });
    });

    test('Should return status 500 - Internal Server Error', () => {
        request = mockRequest();
        response = mockResponse();
        internalServerError(request, response);

        expect(response.status).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveBeenCalledWith(500);
        expect(response.json).toHaveBeenCalledTimes(1);
        expect(response.json).toHaveBeenCalledWith({
            code: 500,
            message: 'Internal Server Error'
        });
    });

    test('Should return status 501 - Not Implemented', () => {
        request = mockRequest();
        response = mockResponse();
        notImplemented(request, response);

        expect(response.status).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveBeenCalledWith(501);
        expect(response.json).toHaveBeenCalledTimes(1);
        expect(response.json).toHaveBeenCalledWith({
            code: 501,
            message: 'Not Implemented'
        });
    });

    test('Should return status 503 - Service Unavailable', () => {
        request = mockRequest();
        response = mockResponse();
        serviceUnavailable(request, response);

        expect(response.status).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveBeenCalledWith(503);
        expect(response.json).toHaveBeenCalledTimes(1);
        expect(response.json).toHaveBeenCalledWith({
            code: 503,
            message: 'Service Unavailable'
        });
    });

    test('Should return status 999 - Custom message', () => {
        request = mockRequest();
        response = mockResponse();
        custom(request, response, 999, 'Custom message');

        expect(response.status).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveBeenCalledWith(999);
        expect(response.json).toHaveBeenCalledTimes(1);
        expect(response.json).toHaveBeenCalledWith({
            code: 999,
            message: 'Custom message'
        });
    });
});
