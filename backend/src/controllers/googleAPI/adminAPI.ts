import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import * as schema from '../../utils/googleSchema';

const admin = google.admin('directory_v1');

/**
 * Returns array of buildings, no error handling
 * @param client OAuth2Client
 * @returns
 */
export const getBuildingData = async (
    client: OAuth2Client
): Promise<schema.Building[]> => {
    const result = await admin.resources.buildings.list({
        customer: process.env.GOOGLE_CUSTOMER_ID,
        auth: client
    });

    const buildings = result.data.buildings;

    if (!Array.isArray(buildings) || !buildings.length) {
        throw new Error('Could not get buildings');
    }

    return buildings;
};

/**
 * Return array of rooms in organization, no error handling
 * @param client OAuth2Client
 * @param building Specify building
 * @returns
 */
export const getRoomData = async (
    client: OAuth2Client,
    building?: string
): Promise<schema.CalendarResource[]> => {
    let result;

    if (building) {
        result = await admin.resources.calendars.list({
            customer: process.env.GOOGLE_CUSTOMER_ID,
            orderBy: 'capacity desc',
            query: `resourceCategory=CONFERENCE_ROOM AND buildingId=${building}`,
            auth: client
        });
    } else {
        result = await admin.resources.calendars.list({
            customer: process.env.GOOGLE_CUSTOMER_ID,
            orderBy: 'buildingId, capacity desc',
            query: `resourceCategory=CONFERENCE_ROOM`,
            auth: client
        });
    }

    const rooms = result.data.items;

    if (!Array.isArray(rooms) || !rooms.length) {
        throw new Error('Could not get rooms');
    }

    return rooms;
};
