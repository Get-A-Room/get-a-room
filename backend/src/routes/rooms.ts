import express from 'express';
import * as controller from '../controllers/roomController';

export const router = express.Router();

// Returns all buildings
router.get(
    '/',
    (req, res, next) => {
        const building = req.query.building;
        if (!building) {
            return next();
        }

        return controller.validateBuildingInOrg(req, res, building, next);
    },
    (req, res) => {
        if (!req.query.building) {
            return controller.getRooms(req, res);
        }

        return controller.getRoomsBuilding(req, res, req.query.building);
    }
);
