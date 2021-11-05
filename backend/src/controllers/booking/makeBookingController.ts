import { Request, Response, NextFunction } from 'express';
import { DateTime } from 'luxon';
import * as calendar from '../googleAPI/calendarAPI';
import * as responses from '../../utils/responses';
import { OAuth2Client } from 'google-auth-library';
import * as schema from '../../utils/googleSchema';
import _ from 'lodash';

/**
 * Validates booking body
 * @returns
 */
export const validateInput = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (
                !req.body.roomId ||
                !req.body.title ||
                !req.body.duration ||
                !Number.isInteger(req.body.duration)
            ) {
                return responses.badRequest(req, res);
            }

            res.locals.roomId = req.body.roomId;
            res.locals.title = req.body.title;
            res.locals.duration = req.body.duration;

            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};

/**
 * Book a room
 * @returns
 */
export const makeBooking = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const startTime = DateTime.now().toISO();
            const endTime = DateTime.now()
                .plus({ minutes: req.body.duration })
                .toISO();

            const client: OAuth2Client = res.locals.oAuthClient;
            const response = await calendar.createEvent(
                client,
                res.locals.roomId,
                res.locals.email,
                res.locals.title,
                startTime,
                endTime
            );

            if (!response.id) {
                return responses.internalServerError(req, res);
            }

            res.locals.event = response;
            res.locals.eventId = response.id;

            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};

/**
 * Add res.locals.roomAccepted boolean that tells if the room has accepted the event
 * NOTE: If we somehow can get around this, the calls would be 3x faster!
 * @returns
 */
export const checkRoomAccepted = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (req.query.noConfirmation) {
            return next();
        }

        try {
            const client: OAuth2Client = res.locals.oAuthClient;
            const eventId: string = res.locals.eventId;
            const roomId: string = res.locals.roomId;

            // NOTE: For some reason, the first response doesn't contain details about the rooms status,
            // so do request and check its response to see if the room has accepted the event
            // Also the acceptance seems to take some time on Google's end, so we try and wait a
            // few times before giving up (usually it seems to take 300-500ms)
            for (let i = 0; i < 8; i += 1) {
                const eventData = await calendar.getEventData(client, eventId);
                const attendees = eventData.attendees;
                res.locals.event = eventData;

                const room = _.find(attendees, (x) => {
                    return x.email === roomId;
                });

                if (!room) {
                    break;
                }

                if (room.responseStatus !== 'needsAction') {
                    res.locals.roomAccepted =
                        room.responseStatus === 'accepted';
                    return next();
                }

                // Sleep for 125ms
                await new Promise((resolve) => setTimeout(resolve, 125));
            }

            res.locals.roomAccepted = false;
            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};

/**
 * Removes the event if res.locals.roomAccepted is false
 * @returns
 */
export const removeDeclinedEvent = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (req.query.noConfirmation) {
            return next();
        }

        try {
            const client: OAuth2Client = res.locals.oAuthClient;
            const roomAccepted: boolean = res.locals.roomAccepted;
            const eventId: string = res.locals.eventId;

            if (!client) {
                throw new Error('Client not defined');
            }

            if (!roomAccepted && eventId) {
                await calendar.deleteEvent(client, eventId);
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
 * Simplify the event data to defined type
 * @returns
 */
export const simplifyEventData = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const event: schema.EventData = res.locals.event;
            const roomId: string = res.locals.roomId;

            // TODO: Should we fetch room data from Google here to match defined API?

            const simpleEvent = {
                id: event.id,
                startTime: event.start?.dateTime,
                endTime: event.end?.dateTime,
                room: {
                    id: roomId
                }
            };

            // Check if any of the properties are undefined
            if (
                !simpleEvent.id ||
                !simpleEvent.startTime ||
                !simpleEvent.endTime ||
                !simpleEvent.room.id
            ) {
                throw new Error('Property undefined');
            }

            res.locals.event = simpleEvent;
            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};
