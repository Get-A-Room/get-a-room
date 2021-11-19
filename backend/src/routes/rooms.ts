import express from 'express';
import { query, validationResult } from 'express-validator';
import { validateBuildingInOrg } from '../controllers/validateBuildingInOrg';
import * as controller from '../controllers/roomController';
import * as responses from '../utils/responses';

export const router = express.Router();

// Returns all buildings
router.get(
    '/',
    query('showReserved').toBoolean(),
    query('building').trim().escape().isString().optional({ nullable: true }),
    query('until').trim().escape().isISO8601().optional({ nullable: true }),
    (req, res, next) => {
        if (!validationResult(req).isEmpty()) {
            return responses.badRequest(req, res);
        }
        next();
    },
    validateBuildingInOrg(),
    controller.addAllRooms(),
    controller.fetchAvailability(),
    controller.writeReservationData(),
    controller.removeReservedRooms(),
    (req, res) => {
        return res.json({ rooms: res.locals.rooms });
    }
);
