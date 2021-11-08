import express from 'express';
import { router as googleRouter } from '../controllers/googleController';

export const router = express.Router();

// Google authentication
router.use('/google', googleRouter);

// Log out
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.status(204).send('No Content');
});
