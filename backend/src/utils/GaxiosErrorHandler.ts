import { Request, Response, NextFunction } from 'express';
import { GaxiosError } from 'gaxios';
import * as responses from '../utils/responses';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Handle Gaxios errors
 * @returns
 */
export const gaxiosErrorHandler = () => {
    const middleware = (
        err: any,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (err instanceof GaxiosError) {
            switch (err.message) {
                case 'Invalid Input: filter':
                    return responses.badRequest(req, res);
                case 'Invalid Credentials':
                    return responses.unauthorized(req, res);
                case 'invalid_grant':
                    return responses.unauthorized(req, res);
                case 'Resource has been deleted':
                    return responses.notFound(req, res);
                case 'Not Found':
                    return responses.notFound(req, res);
                default:
                    return responses.internalServerError(req, res);
            }
        } else {
            next(err);
        }
    };

    return middleware;
};
