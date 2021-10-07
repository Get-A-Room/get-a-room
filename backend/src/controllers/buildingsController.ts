import express from 'express';
import { google } from 'googleapis';

const admin = google.admin('directory_v1');

export const getBuildings = async (
    req: express.Request,
    res: express.Response
) => {
    const client = req.oAuthClient;

    if (!process.env.GOOGLE_CUSTOMER_ID) {
        return res.status(500).send({
            code: 500,
            message: 'Google Workspace customer id not set'
        });
    }

    admin.resources.buildings
        .list({
            customer: process.env.GOOGLE_CUSTOMER_ID,
            auth: client
        })
        .then((result) => {
            const buildings = result.data.buildings?.map((x) => {
                return {
                    buildingId: x.buildingId,
                    buildingName: x.buildingName,
                    floornames: x.floorNames,
                    description: x.description
                };
            });

            res.json({ buildings });
        })
        .catch((err) => {
            const code = err.response.status;
            const message = err.response.statusText;
            return res.status(code).send({
                code,
                message
            });
        });
};
