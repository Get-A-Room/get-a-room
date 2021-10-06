import express from 'express';

export const router = express.Router();

// Returns all buildings
router.get('/', (req: express.Request, res: express.Response) => {
    res.send('Oispa huone - backend!');
});
