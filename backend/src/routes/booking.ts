import express, { Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { deleteBooking } from '../controllers/booking/deleteBookingController';
import { getBooking } from '../controllers/booking/getBookingController';
import { simplifyEventData } from '../controllers/booking/bookingUtils';
import * as currentBookingsController from '../controllers/booking/currentBookingsController';
import * as makeBookingController from '../controllers/booking/makeBookingController';
import * as updateBookingController from '../controllers/booking/updateBookingController';
import * as responses from '../utils/responses';

export const router = express.Router();

// Make a booking
router.post(
    '/',
    query('noConfirmation').toBoolean(true),
    makeBookingController.validateInput(),
    makeBookingController.checkRoomIsFree(),
    makeBookingController.makeBooking(),
    makeBookingController.checkRoomAccepted(), // This middleware slows things down :(
    makeBookingController.removeDeclinedEvent(),
    simplifyEventData(),
    (req: Request, res: Response) => {
        res.status(201).json(res.locals.event);
    }
);

// Get the status of the current booking of the user
router.get(
    '/current',
    query('until').trim().escape().isISO8601().optional({ nullable: true }),
    (req, res, next) => {
        if (!validationResult(req).isEmpty()) {
            return responses.badRequest(req, res);
        }
        next();
    },
    currentBookingsController.getCurrentBookingsMiddleware(),
    currentBookingsController.simplifyAndFilterCurrentBookingsMiddleware(),
    currentBookingsController.addNextCalendarEventMiddleware(),
    (req: Request, res: Response) => {
        res.status(200).json(res.locals.currentBookings);
    }
);

// Get details of a booking
router.get(
    '/:bookingId',
    getBooking(),
    simplifyEventData(),
    (req: Request, res: Response) => {
        res.status(200).json(res.locals.event);
    }
);

// Delete a booking
router.delete('/:bookingId', deleteBooking(), (req: Request, res: Response) => {
    res.status(204).send('No Content');
});

// Add time to a booking
router.patch(
    '/:bookingId/addTime',
    body('timeToAdd').trim().escape().isNumeric(),
    getBooking(),
    updateBookingController.checkRoomIsFree(),
    updateBookingController.addTimeToBooking(),
    makeBookingController.checkRoomAccepted(),
    updateBookingController.rollBackDeclinedUpdate(),
    simplifyEventData(),
    (req: Request, res: Response) => {
        res.status(200).json(res.locals.event);
    }
);
