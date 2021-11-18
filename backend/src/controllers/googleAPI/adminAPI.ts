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
            orderBy: 'resourceName',
            query: `resourceCategory=CONFERENCE_ROOM AND buildingId="${building}"`,
            auth: client
        });
    } else {
        result = await admin.resources.calendars.list({
            customer: process.env.GOOGLE_CUSTOMER_ID,
            orderBy: 'buildingId, resourceName',
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

/**
 * Gets data of a single room with email address
 * @param client OAuth2Client
 * @param email Email address of the room
 */
export const getSingleRoomData = async (
    client: OAuth2Client,
    email: string
): Promise<schema.CalendarResource> => {
    const result = await admin.resources.calendars.list({
        customer: process.env.GOOGLE_CUSTOMER_ID,
        orderBy: 'resourceName',
        query: `resourceEmail=${email}`,
        auth: client
    });

    if (!Array.isArray(result.data.items) || result.data.items?.length != 1) {
        throw new Error('Could not get room');
    }

    return result.data.items[0];
};
