import express from 'express';
import { router as googleRouter } from '../controllers/googleAuthController';

export const router = express.Router();

// Google authentication
router.use('/google', googleRouter);

// REMOVE THESE WHEN FRONTEND IS READY FOR USE
router.get('/success', (req: express.Request, res: express.Response) => {
    if (req.query.token) {
        res.send(
            `<h1>Google login successful :)</h1><p>Token: ${req.query.token}</p>`
        );
    } else {
        res.send('<h1>Google login successful :)</h1>');
    }
});

router.get('/failure', (req: express.Request, res: express.Response) => {
    res.send('<h1>Google login failed :-(</h1>');
});
