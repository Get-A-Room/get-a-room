import { Request, Response, NextFunction } from 'express';
import { DateTime } from 'luxon';
import { OAuth2Client } from 'google-auth-library';
import * as calendar from '../googleAPI/calendarAPI';
import * as responses from '../../utils/responses';
import * as schema from '../../utils/googleSchema';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Add time to current booking
 * @returns
 */
export const addTimeToBooking = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const bookingId: string = req.params.bookingId;
            const client: OAuth2Client = res.locals.oAuthClient;
            const eventData: schema.EventData = res.locals.event;
            const timeToAdd: number = req.body.timeToAdd;

            // New end time
            const endTime = DateTime.fromISO(eventData.end?.dateTime as string)
                .plus({ minutes: timeToAdd })
                .toISO();

            // Pretty hacky and there probably is a better way to do this
            const attendeeList: schema.EventAttendee[] = [
                {
                    email: res.locals.roomId,
                    resource: true,
                    responseStatus: 'needsAction'
                },
                { email: res.locals.email, responseStatus: 'accepted' }
            ];

            const result = await calendar.updateEndTime(
                client,
                bookingId,
                endTime,
                attendeeList
            );
            res.locals.event = result;

            next();
        } catch (err: any) {
            return responses.internalServerError(req, res);
        }
    };

    return middleware;
};

/**
 * Checks if the rooms if free before making a change
 */
export const checkRoomIsFree = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const client: OAuth2Client = res.locals.oAuthClient;
            const roomId: string = res.locals.roomId;
            const event: schema.EventData = res.locals.event;
            const timeToAdd: number = req.body.timeToAdd;

            // New end time
            const endTime = DateTime.fromISO(event.end?.dateTime as string)
                .plus({ minutes: timeToAdd })
                .toISO();

            const freeBusyResult = (
                await calendar.freeBusyQuery(
                    client,
                    [{ id: roomId }],
                    event.end?.dateTime as string,
                    endTime
                )
            )[roomId];

            if (!freeBusyResult) {
                return responses.internalServerError(req, res);
            }

            // freeBusyResult is equal to end time when there are no
            // reservations between now and end time
            if (DateTime.fromISO(freeBusyResult).toISO() !== endTime) {
                return responses.custom(req, res, 409, 'Conflict');
            }

            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};

/**
 * Roll back the update if required
 * @returns
 */
export const rollBackDeclinedUpdate = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const bookingId: string = req.params.bookingId;
            const client: OAuth2Client = res.locals.oAuthClient;
            const eventData: schema.EventData = res.locals.event;
            const timeToAdd: number = req.body.timeToAdd;
            const roomAccepted: boolean = res.locals.roomAccepted;

            if (roomAccepted) {
                return next();
            }

            // Original end time
            const endTime = DateTime.fromISO(eventData.end?.dateTime as string)
                .minus({ minutes: timeToAdd })
                .toISO();

            // Pretty hacky and there probably is a better way to do this
            const attendeeList: schema.EventAttendee[] = [
                {
                    email: res.locals.roomId,
                    resource: true,
                    responseStatus: 'needsAction'
                },
                { email: res.locals.email, responseStatus: 'accepted' }
            ];

            await calendar.updateEndTime(
                client,
                bookingId,
                endTime,
                attendeeList
            );

            return responses.custom(req, res, 409, 'Conflict');
        } catch (err: any) {
            return responses.internalServerError(req, res);
        }
    };

    return middleware;
};
