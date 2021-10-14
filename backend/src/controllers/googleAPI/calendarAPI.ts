import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import _ from 'lodash';
import * as schema from '../../utils/googleSchema';

const calendar = google.calendar('v3');

/**
 * Run freeBusyQuery for items and return array containing objects
 * with id and start of next or current event
 * @param client OAuth2Client
 * @param items Items to query
 * @param start Start time
 * @param end End time
 * @returns
 */
export const freeBusyQuery = async (
    client: OAuth2Client,
    items: any[],
    start: string,
    end: string
): Promise<any> => {
    try {
        const queryResult = await calendar.freebusy.query({
            requestBody: {
                timeMin: start,
                timeMax: end,
                items: items,
                calendarExpansionMax: items.length
            },
            auth: client
        });

        const calendars = queryResult.data.calendars;
        const results: any = {};

        _.forIn(calendars, (data: schema.FreeBusyCalendar, id: string) => {
            let startOfReservation: string | null | undefined = end;

            if (Array.isArray(data.busy) && data.busy.length !== 0) {
                startOfReservation = data.busy[0].start;
            }

            results[id] = startOfReservation;
        });

        return results;
    } catch (err) {
        throw err;
    }
};
