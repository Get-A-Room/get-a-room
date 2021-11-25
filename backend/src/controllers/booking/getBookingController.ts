import { Request, Response, NextFunction } from 'express';
import * as calendar from '../googleAPI/calendarAPI';
import * as responses from '../../utils/responses';
import { OAuth2Client } from 'google-auth-library';
import _ from 'lodash';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Get booking with booking id
 * @returns
 */
export const getBooking = () => {
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

            const eventData = await calendar.getEventData(client, bookingId);
            res.locals.event = eventData;
            res.locals.eventId = bookingId;

            // Get room id from attendees
            _.forEach(eventData.attendees, (attendee) => {
                if (attendee.resource) {
                    // Attendee is a room
                    res.locals.roomId = attendee.email;
                    return false;
                }
            });

            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};
