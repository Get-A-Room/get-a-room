import express from 'express';
import { query } from 'express-validator';
import * as controller from '../controllers/roomController';
import { validateBuildingInOrg } from '../controllers/buildingsController';

export const router = express.Router();

// Returns all buildings
router.get(
    '/',
    query('showReserved').toBoolean(),
    query('building').trim().escape(),
    validateBuildingInOrg(),
    controller.addAllRooms(),
    controller.fetchAvailability(),
    controller.writeReservationData(),
    (req, res) => {
        return res.json({ rooms: res.locals.rooms });
    }
);
