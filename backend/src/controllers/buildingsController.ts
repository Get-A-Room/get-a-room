import express from 'express';
import buildingData from '../data/buildings.json';

export const getBuildings = (req: express.Request, res: express.Response) => {
    res.json(buildingData);
};
