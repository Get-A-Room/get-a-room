import { Request, Response } from 'express';
import { mocked } from 'ts-jest/utils';
import * as schema from '../../utils/googleSchema';
import { DateTime } from 'luxon';
import { badRequest, custom, internalServerError } from '../../utils/responses';
import { query } from 'express-validator';
import currentBookingData from '../../types/currentBookingData';
import RoomData from '../../types/roomData';

import {
    getCurrentBookingsMiddleware,
    simplifyAndFilterCurrentBookingsMiddleware,
    simplifyBookings
} from './currentBookingsController';

import {
    createEvent,
    deleteEvent,
    getEventData,
    getCurrentBookings
} from '../googleAPI/calendarAPI';
import { getRoomData } from '../googleAPI/adminAPI';
import { simplifyRoomData } from '../../controllers/roomController';

jest.mock('../../utils/responses');
jest.mock('../googleAPI/calendarAPI');
// jest.mock('./currentBookingsController');

const mockedGetCurrentBookings = mocked(getCurrentBookings, false);
const mockedSimplifyBookings = mocked(simplifyBookings, false);
const mockedSimplifyRoomData = mocked(simplifyRoomData, false);

const mockedInternalServerError = mocked(internalServerError, false);

describe('currentBookingsController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    describe('getCurrentBookingsMiddleware', () => {
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
            mockedGetCurrentBookings.mockResolvedValueOnce(
                allCurrentAndFutureBookings
            );

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

        test('Should respond with internal server error if response object is empty', async () => {
            mockedGetCurrentBookings.mockResolvedValueOnce({});

            await getCurrentBookingsMiddleware()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedGetCurrentBookings).toBeCalledTimes(1);
            expect(mockedInternalServerError).toBeCalledWith(
                mockRequest,
                mockResponse
            );
            expect(mockNext).not.toBeCalled();
        });
    });

    // describe('simplifyAndFilterCurrentBookingsMiddleware', () => {
    //     test('Should simplify and filter current bookings correctly', async () => {
    //         mocked.mockResolvedValueOnce(simplifiedBookings);

    //         await simplifyAndFilterCurrentBookingsMiddleware()(
    //             mockRequest as Request,
    //             mockResponse as Response,
    //             mockNext
    //         );
    //     });
    // });

    // describe('simplifyBookings', () => {
    //     test('Should simplify and filter current bookings correctly', async () => {
    //         mockedSimplifyRoomData.mockReturnValue(roomsSimplified);
    //         const simplifiedBookings: currentBookingData[] = simplifyBookings(
    //             allBookings,
    //             rooms
    //         );
    //         expect(true).toBe(true);
    //     });
    // });
});

const allCurrentAndFutureBookings: schema.EventsData = {
    kind: 'calendar#events',
    etag: '"p33oc51mcnq9f80g"',
    summary: 'testi@oispahuone.com',
    updated: '2021-11-12T09:16:19.910Z',
    timeZone: 'Europe/Helsinki',
    accessRole: 'owner',
    defaultReminders: [
        {
            method: 'popup',
            minutes: 10
        }
    ],
    nextSyncToken: 'CPDChsy-kvQCEPDChsy-kvQCGAUgpfXcwgE=',
    items: [
        {
            kind: 'calendar#event',
            etag: '"3273413378227000"',
            id: '1j17pp72bmld5an9abls35p298',
            status: 'confirmed',
            htmlLink:
                'https://www.google.com/calendar/event?eid=MWoxN3BwNzJibWxkNWFuOWFibHMzNXAyOTggdGVzdGlAb2lzcGFodW9uZS5jb20',
            created: '2021-11-12T08:13:25.000Z',
            updated: '2021-11-12T09:16:12.700Z',
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
                dateTime: '2021-11-12T11:00:00+02:00',
                timeZone: 'Europe/Helsinki'
            },
            end: {
                dateTime: '2021-11-12T12:00:00+02:00',
                timeZone: 'Europe/Helsinki'
            },
            iCalUID: '1j17pp72bmld5an9abls35p298@google.com',
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
        },
        {
            kind: 'calendar#event',
            etag: '"3273417159820000"',
            id: '3pt0pdqmgp0c4qa8a7o4ie0an4',
            status: 'confirmed',
            htmlLink:
                'https://www.google.com/calendar/event?eid=M3B0MHBkcW1ncDBjNHFhOGE3bzRpZTBhbjQgdGVzdGlAb2lzcGFodW9uZS5jb20',
            created: '2021-11-12T08:13:07.000Z',
            updated: '2021-11-12T09:16:19.910Z',
            summary: 'Seuraava testivaraus',
            location: 'Hakaniemi-7-Höyhen (4) [TV]',
            creator: {
                email: 'testi@oispahuone.com',
                self: true
            },
            organizer: {
                email: 'testi@oispahuone.com',
                self: true
            },
            start: {
                dateTime: '2021-11-12T12:00:00+02:00',
                timeZone: 'Europe/Helsinki'
            },
            end: {
                dateTime: '2021-11-12T13:00:00+02:00',
                timeZone: 'Europe/Helsinki'
            },
            iCalUID: '3pt0pdqmgp0c4qa8a7o4ie0an4@google.com',
            sequence: 2,
            attendees: [
                {
                    email: 'c_188dlqruaau34j82gd69abdo87gs6@resource.calendar.google.com',
                    displayName: 'Hakaniemi-7-Höyhen (4) [TV]',
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
            hangoutLink: 'https://meet.google.com/vwx-ueyd-sjz',
            conferenceData: {
                entryPoints: [
                    {
                        entryPointType: 'video',
                        uri: 'https://meet.google.com/vwx-ueyd-sjz',
                        label: 'meet.google.com/vwx-ueyd-sjz'
                    },
                    {
                        entryPointType: 'more',
                        uri: 'https://tel.meet/vwx-ueyd-sjz?pin=3659512918728',
                        pin: '3659512918728'
                    },
                    {
                        regionCode: 'FI',
                        entryPointType: 'phone',
                        uri: 'tel:+358-9-85691357',
                        label: '+358 9 85691357',
                        pin: '645186061'
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
                conferenceId: 'vwx-ueyd-sjz',
                signature: 'AGirE/IqimCwC2av7RB8uc3WB5EO'
            },
            reminders: {
                useDefault: true
            },
            eventType: 'default'
        }
    ]
};

const allBookings: schema.Event[] = [
    {
        kind: 'calendar#event',
        etag: '"3273413378227000"',
        id: '1j17pp72bmld5an9abls35p298',
        status: 'confirmed',
        htmlLink:
            'https://www.google.com/calendar/event?eid=MWoxN3BwNzJibWxkNWFuOWFibHMzNXAyOTggdGVzdGlAb2lzcGFodW9uZS5jb20',
        created: '2021-11-12T08:13:25.000Z',
        updated: '2021-11-12T09:16:12.700Z',
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
            dateTime: '2021-11-12T11:00:00+02:00',
            timeZone: 'Europe/Helsinki'
        },
        end: {
            dateTime: '2021-11-12T12:00:00+02:00',
            timeZone: 'Europe/Helsinki'
        },
        iCalUID: '1j17pp72bmld5an9abls35p298@google.com',
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
    },
    {
        kind: 'calendar#event',
        etag: '"3273417159820000"',
        id: '3pt0pdqmgp0c4qa8a7o4ie0an4',
        status: 'confirmed',
        htmlLink:
            'https://www.google.com/calendar/event?eid=M3B0MHBkcW1ncDBjNHFhOGE3bzRpZTBhbjQgdGVzdGlAb2lzcGFodW9uZS5jb20',
        created: '2021-11-12T08:13:07.000Z',
        updated: '2021-11-12T09:16:19.910Z',
        summary: 'Seuraava testivaraus',
        location: 'Hakaniemi-7-Höyhen (4) [TV]',
        creator: {
            email: 'testi@oispahuone.com',
            self: true
        },
        organizer: {
            email: 'testi@oispahuone.com',
            self: true
        },
        start: {
            dateTime: '2021-11-12T12:00:00+02:00',
            timeZone: 'Europe/Helsinki'
        },
        end: {
            dateTime: '2021-11-12T13:00:00+02:00',
            timeZone: 'Europe/Helsinki'
        },
        iCalUID: '3pt0pdqmgp0c4qa8a7o4ie0an4@google.com',
        sequence: 2,
        attendees: [
            {
                email: 'c_188dlqruaau34j82gd69abdo87gs6@resource.calendar.google.com',
                displayName: 'Hakaniemi-7-Höyhen (4) [TV]',
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
        hangoutLink: 'https://meet.google.com/vwx-ueyd-sjz',
        conferenceData: {
            entryPoints: [
                {
                    entryPointType: 'video',
                    uri: 'https://meet.google.com/vwx-ueyd-sjz',
                    label: 'meet.google.com/vwx-ueyd-sjz'
                },
                {
                    entryPointType: 'more',
                    uri: 'https://tel.meet/vwx-ueyd-sjz?pin=3659512918728',
                    pin: '3659512918728'
                },
                {
                    regionCode: 'FI',
                    entryPointType: 'phone',
                    uri: 'tel:+358-9-85691357',
                    label: '+358 9 85691357',
                    pin: '645186061'
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
            conferenceId: 'vwx-ueyd-sjz',
            signature: 'AGirE/IqimCwC2av7RB8uc3WB5EO'
        },
        reminders: {
            useDefault: true
        },
        eventType: 'default'
    }
];

const roomsSimplified: RoomData[] = [
    {
        id: '80430164898',
        name: 'Höyhen',
        email: 'c_188dlqruaau34j82gd69abdo87gs6@resource.calendar.google.com',
        capacity: 4,
        building: 'Hakaniemi',
        floor: '7',
        features: ['Internal Only', 'Jabra', 'TV'],
        nextCalendarEvent: '-1',
        location: 'Hakaniemi-7-Höyhen (4) [TV]'
    },
    {
        id: '37827091674',
        name: 'Tavu',
        email: 'c_1881ek7mqrcqmg7ik3k1affbcpsl6@resource.calendar.google.com',
        capacity: 999,
        building: 'Arkadia',
        floor: '4',
        features: [],
        nextCalendarEvent: '-1',
        location: 'Arkadia-4-Tavu (999)'
    }
];

const rooms: schema.CalendarResource[] = [
    {
        kind: 'admin#directory#resources#calendars#CalendarResource',
        etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/DLVKQox_Vu3FbiPWgufRjSVMb6s"',
        resourceId: '85866896181',
        resourceName: 'Sofas',
        generatedResourceName: 'Hermia 5-2-Namu-Sofas (10) [TV]',
        resourceType: 'Plaza',
        resourceEmail:
            'c_188dh3ujphp7ghn8l6udv5v0ilmqq@resource.calendar.google.com',
        capacity: 10,
        buildingId: 'Hermia 5',
        floorName: '2',
        floorSection: 'Namu',
        resourceCategory: 'CONFERENCE_ROOM',
        featureInstances: [
            {
                feature: {
                    kind: 'admin#directory#resources#features#Feature',
                    etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/0ETa0Jg5wfrJFfrwF3W02f1Qnu4"',
                    name: 'Sofa'
                }
            },
            {
                feature: {
                    kind: 'admin#directory#resources#features#Feature',
                    etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/-JiAhNGel-eBf9xovBMSYPsKnkg"',
                    name: 'Streaming'
                }
            },
            {
                feature: {
                    kind: 'admin#directory#resources#features#Feature',
                    etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/3AbY8PnGoFT8NrssnHU9wYAshAE"',
                    name: 'TV'
                }
            }
        ]
    },
    {
        kind: 'admin#directory#resources#calendars#CalendarResource',
        etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/JQaNJ048WKgbD_fYUXZ7T7gNe0k"',
        resourceId: '80430164898',
        resourceName: 'Höyhen',
        generatedResourceName: 'Hakaniemi-7-Höyhen (4) [TV]',
        resourceType: 'Meeting room',
        resourceEmail:
            'c_188dlqruaau34j82gd69abdo87gs6@resource.calendar.google.com',
        capacity: 4,
        buildingId: 'Hakaniemi',
        floorName: '7',
        resourceCategory: 'CONFERENCE_ROOM',
        userVisibleDescription: 'Internal only',
        featureInstances: [
            {
                feature: {
                    kind: 'admin#directory#resources#features#Feature',
                    etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/srb_9oJRl1hmLTsFDyzMtyOxs5g"',
                    name: 'Internal Only'
                }
            },
            {
                feature: {
                    kind: 'admin#directory#resources#features#Feature',
                    etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/KWXPLAFpLHAOiS8NysrI-yn9bXk"',
                    name: 'Jabra'
                }
            },
            {
                feature: {
                    kind: 'admin#directory#resources#features#Feature',
                    etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/3AbY8PnGoFT8NrssnHU9wYAshAE"',
                    name: 'TV'
                }
            }
        ]
    },
    {
        kind: 'admin#directory#resources#calendars#CalendarResource',
        etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/jcT41n7Sg9EKqcaSDAFP1WtFF8o"',
        resourceId: '9389184770',
        resourceName: 'Arkadia',
        generatedResourceName: 'Arkadia-4-Arkadia (6) [TV]',
        resourceType: 'Conference room',
        resourceEmail:
            'c_188fib500s84uis7kcpb6dfm93v24@resource.calendar.google.com',
        capacity: 6,
        buildingId: 'Arkadia',
        floorName: '4',
        resourceCategory: 'CONFERENCE_ROOM',
        featureInstances: [
            {
                feature: {
                    kind: 'admin#directory#resources#features#Feature',
                    etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/4uNt5AWXWrv8NDP5lzYvnZ6Ryeo"',
                    name: 'High Table'
                }
            },
            {
                feature: {
                    kind: 'admin#directory#resources#features#Feature',
                    etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/KWXPLAFpLHAOiS8NysrI-yn9bXk"',
                    name: 'Jabra'
                }
            },
            {
                feature: {
                    kind: 'admin#directory#resources#features#Feature',
                    etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/3AbY8PnGoFT8NrssnHU9wYAshAE"',
                    name: 'TV'
                }
            },
            {
                feature: {
                    kind: 'admin#directory#resources#features#Feature',
                    etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/jbcrubBqGJ5DbyjOng7LCM77F6E"',
                    name: 'Whiteboard'
                }
            }
        ]
    },
    {
        kind: 'admin#directory#resources#calendars#CalendarResource',
        etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/ah-H7ssPhz3tzqRoBgoQwTzEDJo"',
        resourceId: '1752049657',
        resourceName: 'Parlamentti',
        generatedResourceName: 'Arkadia-4-Parlamentti (12) [TV]',
        resourceType: 'Conference room',
        resourceEmail:
            'c_188beek3947jqia9kf9vjr24u8bkc@resource.calendar.google.com',
        capacity: 12,
        buildingId: 'Arkadia',
        floorName: '4',
        resourceCategory: 'CONFERENCE_ROOM',
        featureInstances: [
            {
                feature: {
                    kind: 'admin#directory#resources#features#Feature',
                    etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/KWXPLAFpLHAOiS8NysrI-yn9bXk"',
                    name: 'Jabra'
                }
            },
            {
                feature: {
                    kind: 'admin#directory#resources#features#Feature',
                    etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/3AbY8PnGoFT8NrssnHU9wYAshAE"',
                    name: 'TV'
                }
            },
            {
                feature: {
                    kind: 'admin#directory#resources#features#Feature',
                    etags: '"wpAzWIsneVBI9rTZTZY-s_ywDJRgdmvjfoNAdCUX0A8/jbcrubBqGJ5DbyjOng7LCM77F6E"',
                    name: 'Whiteboard'
                }
            }
        ]
    }
];
