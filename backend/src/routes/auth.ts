import express from 'express';
import { router as googleRouter } from '../controllers/googleController';

export const router = express.Router();

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

// Google authentication
router.use('/google', googleRouter);

// Log out
router.use('/logout', (req, res) => {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.redirect(`${frontendUrl}`);
});
