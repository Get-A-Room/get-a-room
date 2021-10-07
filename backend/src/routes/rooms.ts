import express from 'express';
import { query } from 'express-validator';
import * as controller from '../controllers/roomController';

export const router = express.Router();

// Returns all buildings
router.get(
    '/',
    query('showReserved').toBoolean(),
    query('building').trim().escape(),
    controller.validateBuildingInOrg(),
    controller.addAllRooms(),
    controller.removeReservedRooms(),
    (req, res) => {
        return res.json({ rooms: res.locals.rooms });
    }
);
