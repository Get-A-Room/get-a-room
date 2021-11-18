import { Request, Response, NextFunction } from 'express';
import * as calendar from '../googleAPI/calendarAPI';
import * as responses from '../../utils/responses';
import { OAuth2Client } from 'google-auth-library';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Delete a booking
 * @returns
 */
export const deleteBooking = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const bookingId: string = req.params.bookingId;
            const client: OAuth2Client = res.locals.oAuthClient;

            if (!bookingId || bookingId.length !== 26) {
                return responses.badRequest(req, res);
            }

            await calendar.deleteEvent(client, bookingId);

            next();
        } catch (err: any) {
            if (
                err.response.data.error.code === 410 ||
                err.response.data.error.code === 404
            ) {
                return responses.notFound(req, res);
            }

            return responses.internalServerError(req, res);
        }
    };

    return middleware;
};