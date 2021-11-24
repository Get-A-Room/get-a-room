import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import _ from 'lodash';
import { DateTime } from 'luxon';
import * as schema from '../../utils/googleSchema';

const calendar = google.calendar('v3');

type NextEventById = Record<string, string | null | undefined>;

/**
 * Create an event, will not check if the rooms is free
 * @param client OAuth2Client
 * @param room Room email
 * @param organizer Email of the current user
 * @param title Title of the event
 * @param start Start of the event
 * @param end End of the event
 */
export const createEvent = async (
    client: OAuth2Client,
    room: string,
    organizer: string,
    title: string,
    start: string,
    end: string
): Promise<schema.EventData> => {
    const startDt: schema.EventDateTime = {
        dateTime: start,
        timeZone: 'Etc/UTC'
    };
    const endDt: schema.EventDateTime = {
        dateTime: end,
        timeZone: 'Etc/UTC'
    };

    const attendeeList: schema.EventAttendee[] = [
        { email: room, resource: true },
        { email: organizer, responseStatus: 'accepted' }
    ];

    const event: schema.EventData = {
        summary: title,
        start: startDt,
        end: endDt,
        attendees: attendeeList,
        reminders: {
            useDefault: false
        }
    };

    const eventResult = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        auth: client
    });

    return eventResult.data;
};

/**
 * Deletes the event of the current client
 * @param client OAuth2Client
 * @param eventId Id of the event to delete
 */
export const deleteEvent = async (client: OAuth2Client, eventId: string) => {
    await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
        sendUpdates: 'none',
        auth: client
    });
};

/**
 * Run freeBusyQuery for items and return array containing objects
 * with id and start of next or current event
 * @param client OAuth2Client
 * @param items Items to query
 * @param start Start time
 * @param end End time
 */
export const freeBusyQuery = async (
    client: OAuth2Client,
    items: schema.FreeBusyRequestItem[],
    start: string,
    end: string
): Promise<NextEventById> => {
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
    const results: NextEventById = {};

    _.forIn(calendars, (data: schema.FreeBusyCalendar, id: string) => {
        let startOfReservation: string | null | undefined = end;

        if (Array.isArray(data.busy) && data.busy.length !== 0) {
            startOfReservation = data.busy[0].start;
        }

        results[id] = startOfReservation;
    });

    return results;
};

/**
 * Gets current bookings of the user
 * @param client OAuth2Client
 */
export const getCurrentBookings = async (
    client: OAuth2Client
): Promise<schema.EventsData> => {
    const now = DateTime.now().toUTC().toISO();

    const eventsList = await calendar.events.list({
        calendarId: 'primary',
        auth: client,
        timeMin: now,
        timeZone: 'Etc/UTC'
    });

    return eventsList.data;
};

/**
 * Gets event status with eventId
 * @param client OAuth2Client
 * @param eventId Id of the event to lookup
 */
export const getEventData = async (
    client: OAuth2Client,
    eventId: string
): Promise<schema.EventData> => {
    const response = await calendar.events.get({
        calendarId: 'primary',
        eventId: eventId,
        auth: client
    });

    return response.data;
};

/**
 * Updates the end time of an event
 * @param client OAuth2Client
 * @param eventId Id of the event to update
 * @param endTime New end time in ISO format
 * @param attendees Set attendees again to set room status to needsAction
 */
export const updateEndTime = async (
    client: OAuth2Client,
    eventId: string,
    endTime: string,
    attendees: schema.EventAttendee[]
): Promise<schema.EventData> => {
    const endDt: schema.EventDateTime = {
        dateTime: endTime,
        timeZone: 'Etc/UTC'
    };

    const event = await calendar.events.patch({
        calendarId: 'primary',
        eventId: eventId,
        auth: client,
        requestBody: {
            end: endDt,
            attendees: attendees
        }
    });

    return event.data;
};
