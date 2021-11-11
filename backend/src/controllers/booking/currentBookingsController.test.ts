import { Request, Response } from 'express';
import { mocked } from 'ts-jest/utils';
import * as schema from '../../utils/googleSchema';
import { DateTime } from 'luxon';
import { badRequest, custom, internalServerError } from '../../utils/responses';
import { query } from 'express-validator';

import { getCurrentBookingsMiddleware } from './currentBookingsController';

import {
    createEvent,
    deleteEvent,
    getEventData,
    getCurrentBookings
} from '../googleAPI/calendarAPI';

// jest.mock('../../utils/responses');
jest.mock('../googleAPI/calendarAPI');
// jest.mock('./currentBookingsController');

const mockedGetCurrentBookings = mocked(getCurrentBookings, false);

describe('currentBookingsController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            locals: {
                oAuthClient: 'client'
            }
        };
        mockNext = jest.fn();

        jest.resetAllMocks();
    });

    test('Should set data to res.locals.currentBookings', async () => {
        mockedGetCurrentBookings.mockResolvedValueOnce(allCurrentBookings);

        await getCurrentBookingsMiddleware()(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        const currentBookings: schema.EventsData =
            mockResponse?.locals?.currentBookings;

        expect(currentBookings).not.toBeFalsy();
        expect(currentBookings.items).not.toBeUndefined();
        expect(currentBookings?.kind).toBe('calendar#events');
        expect(currentBookings?.items?.length === 5);
    });
});

const allCurrentBookings: schema.EventsData = {
    kind: 'calendar#events',
    etag: '"p32k899ehum8f80g"',
    summary: 'testi@oispahuone.com',
    updated: '2021-11-11T18:17:15.369Z',
    timeZone: 'Europe/Helsinki',
    accessRole: 'owner',
    defaultReminders: [
        {
            method: 'popup',
            minutes: 10
        }
    ],
    nextSyncToken: 'CKiEpdH1kPQCEKiEpdH1kPQCGAUgpfXcwgE=',
    items: [
        {
            kind: 'calendar#event',
            etag: '"3273304271736000"',
            id: '1mceh07d3ouhe5grn5qr1q7jm5',
            status: 'confirmed',
            htmlLink:
                'https://www.google.com/calendar/event?eid=MW1jZWgwN2Qzb3VoZTVncm41cXIxcTdqbTUgdGVzdGlAb2lzcGFodW9uZS5jb20',
            created: '2021-11-11T17:35:32.000Z',
            updated: '2021-11-11T17:35:35.868Z',
            summary: 'Tuleva varaus testi',
            location: '(Conference room)-Mummola-4-Vilpola (1)',
            creator: {
                email: 'testi@oispahuone.com',
                self: true
            },
            organizer: {
                email: 'testi@oispahuone.com',
                self: true
            },
            start: {
                dateTime: '2021-11-11T21:00:00+02:00',
                timeZone: 'Europe/Helsinki'
            },
            end: {
                dateTime: '2021-11-11T22:30:00+02:00',
                timeZone: 'Europe/Helsinki'
            },
            iCalUID: '1mceh07d3ouhe5grn5qr1q7jm5@google.com',
            sequence: 0,
            attendees: [
                {
                    email: 'c_1881u6ri2f46ehvgkdf3t5rklc6ji@resource.calendar.google.com',
                    displayName: '(Conference room)-Mummola-4-Vilpola (1)',
                    resource: true,
                    responseStatus: 'accepted'
                },
                {
                    email: 'testi@oispahuone.com',
                    organizer: true,
                    self: true,
                    responseStatus: 'accepted'
                }
            ],
            hangoutLink: 'https://meet.google.com/zwr-fgpa-wpv',
            conferenceData: {
                entryPoints: [
                    {
                        entryPointType: 'video',
                        uri: 'https://meet.google.com/zwr-fgpa-wpv',
                        label: 'meet.google.com/zwr-fgpa-wpv'
                    },
                    {
                        entryPointType: 'more',
                        uri: 'https://tel.meet/zwr-fgpa-wpv?pin=7626226443877',
                        pin: '7626226443877'
                    },
                    {
                        regionCode: 'FI',
                        entryPointType: 'phone',
                        uri: 'tel:+358-9-23132983',
                        label: '+358 9 23132983',
                        pin: '397194295'
                    }
                ],
                conferenceSolution: {
                    key: {
                        type: 'hangoutsMeet'
                    },
                    name: 'Google Meet',
                    iconUri:
                        'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-512dp/logo_meet_2020q4_color_2x_web_512dp.png'
                },
                conferenceId: 'zwr-fgpa-wpv',
                signature: 'AGirE/LACA6Tj0S7IJEk+qQbUw3e'
            },
            reminders: {
                useDefault: true
            },
            eventType: 'default'
        },
        {
            kind: 'calendar#event',
            etag: '"3273304302668000"',
            id: '66qgtip4grcof34vlo820tibf6',
            status: 'confirmed',
            htmlLink:
                'https://www.google.com/calendar/event?eid=NjZxZ3RpcDRncmNvZjM0dmxvODIwdGliZjYgdGVzdGlAb2lzcGFodW9uZS5jb20',
            created: '2021-11-11T17:35:49.000Z',
            updated: '2021-11-11T17:35:51.334Z',
            summary: 'Menossa oleva pitkä varaus testi',
            location: 'Hakaniemi-9-Norsunluutorni (4) [TV, Webcam]',
            creator: {
                email: 'testi@oispahuone.com',
                self: true
            },
            organizer: {
                email: 'testi@oispahuone.com',
                self: true
            },
            start: {
                dateTime: '2021-11-11T14:45:00+02:00',
                timeZone: 'Europe/Helsinki'
            },
            end: {
                dateTime: '2021-11-12T00:00:00+02:00',
                timeZone: 'Europe/Helsinki'
            },
            iCalUID: '66qgtip4grcof34vlo820tibf6@google.com',
            sequence: 0,
            attendees: [
                {
                    email: 'c_1888bqgfcd1g6hmvmka0hk5l6e05u@resource.calendar.google.com',
                    displayName: 'Hakaniemi-9-Norsunluutorni (4) [TV, Webcam]',
                    resource: true,
                    responseStatus: 'accepted'
                },
                {
                    email: 'testi@oispahuone.com',
                    organizer: true,
                    self: true,
                    responseStatus: 'accepted'
                }
            ],
            hangoutLink: 'https://meet.google.com/yss-zhhf-yrq',
            conferenceData: {
                entryPoints: [
                    {
                        entryPointType: 'video',
                        uri: 'https://meet.google.com/yss-zhhf-yrq',
                        label: 'meet.google.com/yss-zhhf-yrq'
                    },
                    {
                        entryPointType: 'more',
                        uri: 'https://tel.meet/yss-zhhf-yrq?pin=6845318594017',
                        pin: '6845318594017'
                    },
                    {
                        regionCode: 'FI',
                        entryPointType: 'phone',
                        uri: 'tel:+358-9-23132941',
                        label: '+358 9 23132941',
                        pin: '318877823'
                    }
                ],
                conferenceSolution: {
                    key: {
                        type: 'hangoutsMeet'
                    },
                    name: 'Google Meet',
                    iconUri:
                        'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-512dp/logo_meet_2020q4_color_2x_web_512dp.png'
                },
                conferenceId: 'yss-zhhf-yrq',
                signature: 'AGirE/JtETQQk68vva2FwWkXBwT7'
            },
            reminders: {
                useDefault: true
            },
            eventType: 'default'
        },
        {
            kind: 'calendar#event',
            etag: '"3273309228648000"',
            id: '13d07tf2b1ch3gf7b378u48l26',
            status: 'confirmed',
            htmlLink:
                'https://www.google.com/calendar/event?eid=MTNkMDd0ZjJiMWNoM2dmN2IzNzh1NDhsMjYgdGVzdGlAb2lzcGFodW9uZS5jb20',
            created: '2021-11-11T18:16:54.000Z',
            updated: '2021-11-11T18:16:54.324Z',
            summary: 'Pidempi varaus ilman resurssia testi',
            creator: {
                email: 'testi@oispahuone.com',
                self: true
            },
            organizer: {
                email: 'testi@oispahuone.com',
                self: true
            },
            start: {
                dateTime: '2021-11-11T18:30:00+02:00',
                timeZone: 'Europe/Helsinki'
            },
            end: {
                dateTime: '2021-11-11T21:45:00+02:00',
                timeZone: 'Europe/Helsinki'
            },
            iCalUID: '13d07tf2b1ch3gf7b378u48l26@google.com',
            sequence: 0,
            reminders: {
                useDefault: true
            },
            eventType: 'default'
        },
        {
            kind: 'calendar#event',
            etag: '"3273306726721000"',
            id: '364vbrjeme18u7590212p6pau4',
            status: 'confirmed',
            htmlLink:
                'https://www.google.com/calendar/event?eid=MzY0dmJyamVtZTE4dTc1OTAyMTJwNnBhdTQgdGVzdGlAb2lzcGFodW9uZS5jb20',
            created: '2021-11-11T17:34:59.000Z',
            updated: '2021-11-11T18:17:07.174Z',
            summary: 'Reservation from Get a Room!',
            location: 'Arkadia-4-Parlamentti (12) [TV]',
            creator: {
                email: 'testi@oispahuone.com',
                self: true
            },
            organizer: {
                email: 'testi@oispahuone.com',
                self: true
            },
            start: {
                dateTime: '2021-11-11T20:15:00+02:00',
                timeZone: 'Europe/Helsinki'
            },
            end: {
                dateTime: '2021-11-11T20:45:00+02:00',
                timeZone: 'Europe/Helsinki'
            },
            iCalUID: '364vbrjeme18u7590212p6pau4@google.com',
            sequence: 1,
            attendees: [
                {
                    email: 'testi@oispahuone.com',
                    organizer: true,
                    self: true,
                    responseStatus: 'accepted'
                },
                {
                    email: 'c_188beek3947jqia9kf9vjr24u8bkc@resource.calendar.google.com',
                    displayName: 'Arkadia-4-Parlamentti (12) [TV]',
                    resource: true,
                    responseStatus: 'accepted'
                }
            ],
            reminders: {
                useDefault: false
            },
            eventType: 'default'
        },
        {
            kind: 'calendar#event',
            etag: '"3273306727300000"',
            id: 'l5ct4hovfddiim695934fg3h38',
            status: 'confirmed',
            htmlLink:
                'https://www.google.com/calendar/event?eid=bDVjdDRob3ZmZGRpaW02OTU5MzRmZzNoMzggdGVzdGlAb2lzcGFodW9uZS5jb20',
            created: '2021-11-11T17:34:51.000Z',
            updated: '2021-11-11T18:17:15.369Z',
            summary: 'Reservation from Get a Room!',
            location: 'Arkadia-4-Tavu (999)',
            creator: {
                email: 'testi@oispahuone.com',
                self: true
            },
            organizer: {
                email: 'testi@oispahuone.com',
                self: true
            },
            start: {
                dateTime: '2021-11-11T20:00:00+02:00',
                timeZone: 'Europe/Helsinki'
            },
            end: {
                dateTime: '2021-11-11T21:00:00+02:00',
                timeZone: 'Europe/Helsinki'
            },
            iCalUID: 'l5ct4hovfddiim695934fg3h38@google.com',
            sequence: 1,
            attendees: [
                {
                    email: 'c_1881ek7mqrcqmg7ik3k1affbcpsl6@resource.calendar.google.com',
                    displayName: 'Arkadia-4-Tavu (999)',
                    resource: true,
                    responseStatus: 'accepted'
                },
                {
                    email: 'testi@oispahuone.com',
                    organizer: true,
                    self: true,
                    responseStatus: 'accepted'
                }
            ],
            reminders: {
                useDefault: false
            },
            eventType: 'default'
        }
    ]
};
