import express from 'express';
import { router as googleRouter } from './auth/google';

export const router = express.Router();

// Google authentication
router.use('/google', googleRouter);

// Log out
router.get('/logout', (req, res) => {
    res.clearCookie('TOKEN');
    res.status(204).send('No Content');
});
