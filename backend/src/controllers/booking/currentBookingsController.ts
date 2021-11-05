import { DateTime } from 'luxon';
import _ from 'lodash';

import { Request, Response, NextFunction } from 'express';
import currentBookingData from '../../interfaces/currentBookingData';
import * as schema from '../../utils/googleSchema';
import * as admin from '../googleAPI/adminAPI';
import * as calendar from '../googleAPI/calendarAPI';
import * as responses from '../../utils/responses';
import { OAuth2Client } from 'google-auth-library';
import { simplifyRoomData } from '../../controllers/roomController';
import roomData from '../../interfaces/roomData';

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

            const rooms: schema.CalendarResource[] = await admin.getRoomData(
                res.locals.oAuthClient
            );
            const roomsSimplified: roomData[] = simplifyRoomData(rooms);

            const simplifiedBookings = allBookings.map(
                (booking: schema.EventData) => {
                    const simpleEvent: currentBookingData = {
                        id: booking.id,
                        startTime: booking.start?.dateTime,
                        endTime: booking.end?.dateTime,
                        room: null
                    };

                    // Finds the room information and includes it inside the simpleEvent
                    const room = roomsSimplified.find((room: any) => {
                        return room.location === booking.location;
                    });
                    simpleEvent.room = room;

                    return simpleEvent;
                }
            );

            res.locals.currentBookings =
                filteCurrentlyRunningBookings(simplifiedBookings);
            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};

/**
 * Filters away every booking that is not currently running
 * @param simplifiedBookings List of simplified bookings
 * @returns filtered bookings
 */
export const filteCurrentlyRunningBookings = (
    simplifiedBookings: currentBookingData[]
): currentBookingData[] => {
    // Filters away all bookings that aren't running at the moment
    const onlyCurrentlyRunningBookings: currentBookingData[] =
        simplifiedBookings.filter((booking: currentBookingData) => {
            if (!booking.startTime || !booking.endTime) {
                return false;
            }

            // Checks that the event has a room or other resource
            if (_.isEmpty(booking.room)) {
                return false;
            }

            const now = DateTime.local().toISO();
            return booking.startTime <= now && booking.endTime >= now;
        });

    return onlyCurrentlyRunningBookings;
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
