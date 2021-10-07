import express from 'express';
import * as controller from '../controllers/roomController';

export const router = express.Router();

// Returns all buildings
router.get(
    '/',
    controller.validateBuildingInOrg(),
    controller.addAllRooms(),
    controller.removeReservedRooms(),
    (req, res) => {
        return res.json({ rooms: res.locals.rooms });
    }
);
