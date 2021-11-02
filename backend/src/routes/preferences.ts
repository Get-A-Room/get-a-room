import express from 'express';
import * as responses from '../utils/responses';

export const router = express.Router();

// Returns preferences
router.get('/', (req, res) => responses.notImplemented(req, res));

// Update preferences
router.put('/', (req, res) => responses.notImplemented(req, res));
