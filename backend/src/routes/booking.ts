import express, { Request, Response } from 'express';
import { query } from 'express-validator';
import * as controller from '../controllers/booking/makeBookingController';
import * as responses from '../utils/responses';

export const router = express.Router();

// Make a booking
router.post(
    '/',
    query('noConfirmation').toBoolean(true),
    controller.validateInput(),
    controller.makeBooking(),
    controller.checkRoomAccepted(), // This middleware slows things down :(
    controller.removeDeclinedEvent(),
    controller.simplifyEventData(),
    (req: Request, res: Response) => {
        res.status(201).json(res.locals.event);
    }
);

// Get the status of the current booking of the user
router.get('/current', (req: Request, res: Response) =>
    responses.notImplemented(req, res)
);

// Get details of a booking
router.get('/:bookingId', (req: Request, res: Response) =>
    responses.notImplemented(req, res)
);

// Delete a booking
router.delete('/:bookingId', (req: Request, res: Response) =>
    responses.notImplemented(req, res)
);

// Add time to a booking
router.patch('/:bookingId/addTime', (req: Request, res: Response) =>
    responses.notImplemented(req, res)
);
