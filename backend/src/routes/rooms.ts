import express from 'express';
import * as controller from '../controllers/roomController';

export const router = express.Router();

// Returns all buildings
router.get('/', (req, res) => {
    if (req.query.building) {
        return controller.getRoomsBuilding(req, res, req.query.building);
    } else {
        return controller.getRooms(req, res);
    }
});
