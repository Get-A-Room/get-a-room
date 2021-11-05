import express from 'express';
import * as responses from '../utils/responses';
import * as controller from '../controllers/preferencesController';
import { validateBuildingInOrg } from '../controllers/buildingsController';

export const router = express.Router();

// Returns preferences
router.get('/', controller.getPreferences(), (req, res) => {
    res.status(200).json({
        building: res.locals.preferences.building || {}
    });
});

// Update preferences
router.put('/', (req, res) => responses.notImplemented(req, res));
