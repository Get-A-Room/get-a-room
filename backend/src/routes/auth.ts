import express from 'express';
import { router as googleRouter } from '../controllers/googleController';

export const router = express.Router();

// Google authentication
router.use('/google', googleRouter);

// REMOVE THESE WHEN FRONTEND IS READY FOR USE
router.get('/success', (req: express.Request, res: express.Response) => {
    if (req.query.token && req.query.name) {
        res.send(
            `<h1>Google login successful :)</h1><h3>User: ${req.query.name}</h3><p>Token: ${req.query.token}</p>`
        );
    } else {
        res.send('<h1>Google login successful :)</h1>');
    }
});

router.get('/failure', (req: express.Request, res: express.Response) => {
    res.send(
        '<h1>Google login failed :-(</h1><a href="/auth/google">Continue</a>'
    );
});
