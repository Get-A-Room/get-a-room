import { Request, Response, NextFunction } from 'express';
import * as admin from '../googleAPI/adminAPI';
import * as schema from '../../utils/googleSchema';
import * as responses from '../../utils/responses';
import { simplifySingleRoomData } from '../roomController';

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

            if (!roomId) {
                return responses.internalServerError(req, res);
            }

            const roomResource = await admin.getSingleRoomData(
                res.locals.oAuthClient,
                roomId
            );
            const roomData = simplifySingleRoomData(roomResource);
            const simpleEvent = {
                id: event.id,
                startTime: event.start?.dateTime,
                endTime: event.end?.dateTime,
                room: roomData
            };

            // Check if any of the properties are undefined
            if (
                !simpleEvent.id ||
                !simpleEvent.startTime ||
                !simpleEvent.endTime ||
                !simpleEvent.room
            ) {
                return responses.internalServerError(req, res);
            }

            res.locals.event = simpleEvent;
            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};
