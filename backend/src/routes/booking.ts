import express, { Request, Response } from 'express';
import { query } from 'express-validator';
import * as makeBookingController from '../controllers/booking/makeBookingController';
import * as currentBookingsController from '../controllers/booking/currentBookingsController';
import * as responses from '../utils/responses';

export const router = express.Router();

// Make a booking
router.post(
    '/',
    query('noConfirmation').toBoolean(true),
    makeBookingController.validateInput(),
    makeBookingController.makeBooking(),
    makeBookingController.checkRoomAccepted(), // This middleware slows things down :(
    makeBookingController.removeDeclinedEvent(),
    makeBookingController.simplifyEventData(),
    (req: Request, res: Response) => {
        res.status(201).json(res.locals.event);
    }
);

// Get the status of the current booking of the user
router.get(
    '/current',
    currentBookingsController.getCurrentBookingsMiddleware(),
    currentBookingsController.simplifyAndFilterCurrentBookingsMiddleware(),
    (req: Request, res: Response) => {
        res.status(200).json(res.locals.currentBookings);
    }
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
