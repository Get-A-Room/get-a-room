import { DateTime } from 'luxon';
import _ from 'lodash';

import { Request, Response, NextFunction } from 'express';
import currentBookingData from '../../interfaces/currentBookingData';
import * as schema from '../../utils/googleSchema';
import * as admin from '../googleAPI/adminAPI';
import * as calendar from '../googleAPI/calendarAPI';
import * as responses from '../../utils/responses';
import { OAuth2Client } from 'google-auth-library';

/**
 * Simplifies and filters current bookings
 * @returns
 */
export const simplifyCurrentBookingsMiddleware = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const allBookings: currentBookingData[] =
                res.locals.currentBookings.items;

            const client = res.locals.oAuthClient;
            const rooms: schema.CalendarResource[] = await admin.getRoomData(
                client
            );

            const simplifiedCurrentBookings = allBookings.map(
                (booking: schema.EventData) => {
                    const simpleEvent: currentBookingData = {
                        id: booking.id,
                        startTime: booking.start?.dateTime,
                        endTime: booking.end?.dateTime,
                        room: null
                    };

                    // Finds the room information and includes it inside the simpleEvent
                    const room = rooms.find((room: schema.CalendarResource) => {
                        return room.generatedResourceName === booking.location;
                    });
                    simpleEvent.room = room;

                    return simpleEvent;
                }
            );

            const onlyCurrentlyRunningBookings =
                simplifiedCurrentBookings.filter(
                    (booking: currentBookingData) => {
                        if (!booking.startTime || !booking.endTime) {
                            return false;
                        }

                        // Checks that the event has a room or other resource
                        if (_.isEmpty(booking.room)) {
                            return false;
                        }

                        const now = DateTime.local().toISO();
                        return (
                            booking.startTime <= now && booking.endTime >= now
                        );
                    }
                );

            res.locals.currentBookings = onlyCurrentlyRunningBookings;
            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};

/**
 * Gets all the users currently active bookings
 * @returns
 */
export const getCurrentBookingsMiddleware = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const client: OAuth2Client = res.locals.oAuthClient;

            const currentBookings: schema.EventsData =
                await calendar.getCurrentBookings(client);

            res.locals.currentBookings = currentBookings;

            if (!currentBookings.items) {
                return responses.internalServerError(req, res);
            }

            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};
