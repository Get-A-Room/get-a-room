import { DateTime } from 'luxon';
import _ from 'lodash';

import { Request, Response, NextFunction } from 'express';
import CurrentBookingData from '../../types/currentBookingData';
import * as schema from '../../utils/googleSchema';
import * as admin from '../googleAPI/adminAPI';
import * as calendar from '../googleAPI/calendarAPI';
import * as responses from '../../utils/responses';
import { OAuth2Client } from 'google-auth-library';
import { simplifyRoomData } from '../../controllers/roomController';
import RoomData from '../../types/roomData';

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

            const allCurrentAndFutureBookings: schema.EventsData =
                await calendar.getCurrentBookings(client);

            res.locals.currentBookings = allCurrentAndFutureBookings;

            if (!allCurrentAndFutureBookings.items) {
                return responses.internalServerError(req, res);
            }

            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};

/**
 * Simplifies and filters current bookings
 * @returns
 */
export const simplifyAndFilterCurrentBookingsMiddleware = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const allBookings: schema.Event[] =
                res.locals.currentBookings.items;

            const rooms: schema.CalendarResource[] = await admin.getRoomData(
                res.locals.oAuthClient
            );

            const simplifiedBookings = simplifyBookings(allBookings, rooms);

            res.locals.currentBookings =
                filterCurrentBookings(simplifiedBookings);

            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};

/**
 * Adds nextCalendarEvent to current kookings
 * @returns
 */
export const addNextCalendarEventMiddleware = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const client = res.locals.oAuthClient;

            const currentBookings: CurrentBookingData[] =
                res.locals.currentBookings;

            // console.log('res.locals.currentBookings res.locals.currentBookings');
            // console.log(currentBookings);
            // console.log('res.locals.currentBookings res.locals.currentBookings');
            const end = DateTime.now().toUTC().endOf('day').toISO();

            // const currentBookingsWithNextCalendarEvent = await currentBookings.map(async (currentBooking) => {

            for (const currentBooking of currentBookings) {
                console.log(currentBooking);
                const testi = [{ id: currentBooking.room?.id }];

                if (currentBooking.endTime) {
                    const result = await calendar.freeBusyQuery(
                        client,
                        testi,
                        currentBooking.endTime,
                        end
                    );

                    console.log('currentBookingsWithNextCalendarEvent');
                    console.log(result);
                    console.log('currentBookingsWithNextCalendarEvent');
                    currentBooking.room.nextCalendarEvent =
                        result[currentBooking.room.id as string];
                }
            }

            res.locals.currentBookings = currentBookings;

            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};

/**
 * Simlpifies bookings
 * @param simplifiedBookings List of all bookings
 * @returns simplified bookings
 */
export const simplifyBookings = (
    allBookings: schema.Event[],
    rooms: schema.CalendarResource[]
): CurrentBookingData[] => {
    // Filters away all bookings that aren't running at the moment
    const roomsSimplified: RoomData[] = simplifyRoomData(rooms);

    const simplifiedBookings = allBookings.map((booking: schema.EventData) => {
        const simpleEvent: CurrentBookingData = {
            id: booking.id,
            startTime: booking.start?.dateTime,
            endTime: booking.end?.dateTime,
            room: {
                id: '',
                name: null,
                capacity: null,
                building: null,
                floor: null,
                features: null,
                nextCalendarEvent: null,
                location: null
            }
        };

        // Finds the room information and includes it inside the simpleEvent
        const room = roomsSimplified.find((room: RoomData) => {
            return room.location === booking.location;
        });

        if (room) {
            simpleEvent.room = room;
        }

        return simpleEvent;
    });

    return simplifiedBookings;
};

/**
 * Filters away every booking that is not currently running
 * @param simplifiedBookings List of simplified bookings
 * @returns filtered bookings
 */
export const filterCurrentBookings = (
    simplifiedBookings: CurrentBookingData[]
): CurrentBookingData[] => {
    const now: string = getNowDateTime();

    // Filters away all bookings that aren't running at the moment
    const onlyCurrentlyRunningBookings: CurrentBookingData[] =
        simplifiedBookings.filter((booking: CurrentBookingData) => {
            if (!booking.startTime || !booking.endTime) {
                return false;
            }

            // Checks that the event has a room or other resource
            if (_.isEmpty(booking.room)) {
                return false;
            }

            return booking.startTime <= now && booking.endTime >= now;
        });

    return onlyCurrentlyRunningBookings;
};

export const getNowDateTime = (): string => {
    return DateTime.now().toUTC().toISO();
};
