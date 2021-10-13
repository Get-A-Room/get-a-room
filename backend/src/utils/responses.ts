import express from 'express';

// This module contains common responses in consistent format

//
// User errors
//

/**
 * Bad Request
 */
export const badRequest = (req: express.Request, res: express.Response) => {
    return res.status(400).json({
        code: 400,
        message: 'Bad Request'
    });
};

/**
 * Unauthorized
 */
export const unauthorized = (req: express.Request, res: express.Response) => {
    return res.status(401).json({
        code: 401,
        message: 'Unauthorized'
    });
};

/**
 * Invalid Token - unofficial
 */
export const invalidToken = (req: express.Request, res: express.Response) => {
    return res.status(401).json({
        code: 401,
        message: 'Invalid Token'
    });
};

/**
 * Forbidden
 */
export const forbidden = (req: express.Request, res: express.Response) => {
    return res.status(403).json({
        code: 403,
        message: 'Forbidden'
    });
};

/**
 * Not Found
 */
export const notFound = (req: express.Request, res: express.Response) => {
    return res.status(404).json({
        code: 404,
        message: 'Not Found'
    });
};

//
// Internal errors
//

/**
 * Internal Server Error
 */
export const internalServerError = (
    req: express.Request,
    res: express.Response
) => {
    return res.status(500).json({
        code: 500,
        message: 'Internal Server Error'
    });
};

/**
 * Not Implemented
 */
export const notImplemented = (req: express.Request, res: express.Response) => {
    return res.status(501).json({
        code: 501,
        message: 'Not Implemented'
    });
};

/**
 * Service Unavailable
 */
export const serviceUnavailable = (
    req: express.Request,
    res: express.Response
) => {
    return res.status(503).json({
        code: 503,
        message: 'Service Unavailable'
    });
};

/**
 * Custom
 */
export const custom = (
    req: express.Request,
    res: express.Response,
    code: number,
    message: string
) => {
    return res.status(code).json({
        code,
        message
    });
};
