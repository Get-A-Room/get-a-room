import express from 'express';

export const router = express.Router();

// Returns index
router.get('/', (req: express.Request, res: express.Response) => {
    res.send('Oispa huone - backend!');
});
