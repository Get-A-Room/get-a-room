import express from 'express';
import * as controller from '../controllers/buildingsController';

export const router = express.Router();

// Returns all buildings
router.get('/', controller.getBuildings);
