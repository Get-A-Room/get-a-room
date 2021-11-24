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
        console.log('testi testi testi CCCCCCCCCCCCCCCC');
        try {
            console.log('testi testi testi PPPPPPPPPPPPP');
            console.log(req.params.bookingId);
            console.log('testi testi testi ALLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaa');
            const bookingId: string = req.params.bookingId;
            console.log(req);

            console.log('testi testi testiYYYYYYYYYYYYYYY');
            const client: OAuth2Client = res.locals.oAuthClient;

            console.log('testi testi testiXXXXXXXXXXXXXXX');

            if (!bookingId || bookingId?.length !== 26) {
                return responses.badRequest(req, res);
            }

            console.log('testi testi testi111111111111111');
            await calendar.deleteEvent(client, bookingId);
            console.log('testi testi testi222222222222222');

            next();
        } catch (err: any) {
            if (
                err?.response?.data?.error?.code === 410 ||
                err?.response?.data?.error?.code === 404
            ) {
                return responses.notFound(req, res);
            }

            return responses.internalServerError(req, res);
        }
    };

    return middleware;
};
