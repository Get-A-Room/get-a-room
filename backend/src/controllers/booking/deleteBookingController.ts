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
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};
