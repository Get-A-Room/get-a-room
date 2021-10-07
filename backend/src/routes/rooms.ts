import express from 'express';
import * as controller from '../controllers/roomController';

export const router = express.Router();

// Returns all buildings
router.get(
    '/',
    controller.validateBuildingInOrg(),
    controller.addAllRooms(),
    (req, res) => {
        return res.json(res.locals.rooms);
    }
);
