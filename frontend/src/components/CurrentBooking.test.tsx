// @ts-nocheck
import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { render, screen } from '@testing-library/react';
import CurrentBooking from './CurrentBooking';
import * as bookingService from '../services/bookingService';
import { getBookings } from '../services/bookingService';

it('renders CurrentBooking.tsx', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CurrentBooking></CurrentBooking>, div);
});

let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it('renders booking data', async () => {
    const fakeBooking = [
        {
            id: '123',
            startTime: '2021-10-21T17:32:28Z',
            endTime: '2021-10-21T19:32:28Z',
            room: {
                id: 'c_188fib500s84uis7kcpb6dfm93v25@resource.calendar.google.com',
                name: 'Amor',
                capacity: 4,
                features: ['Jabra', 'TV', 'Webcam'],
                nextCalendarEvent: '2021-10-21T17:32:28Z'
            }
        }
    ];

    jest.spyOn(bookingService, 'getBookings').mockImplementation(() => {
        return Promise.resolve(fakeBooking);
    });

    render(<CurrentBooking />, container);

    const items = await screen.findByTestId('CurrentBookingCard');
    expect(items).toHaveClass('CurrentBookingCardClass');

    const title = await screen.findByTestId('BookingRoomTitle');
    expect(title).toHaveTextContent('Amor');
});
