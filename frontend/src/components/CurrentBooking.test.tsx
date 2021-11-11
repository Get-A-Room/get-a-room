// @ts-nocheck
import React from 'react';
import { render, screen } from '@testing-library/react';
import CurrentBooking from './CurrentBooking';
import * as bookingService from '../services/bookingService';
import { getBookings } from '../services/bookingService';
import userEvent from '@testing-library/user-event';

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

it('renders booking data and checks for booked room name', async () => {
    jest.spyOn(bookingService, 'getBookings').mockImplementation(() => {
        return Promise.resolve(fakeBooking);
    });

    render(<CurrentBooking bookings={fakeBooking} />);

    const items = await screen.findByTestId('CurrentBookingCard');
    expect(items).toHaveClass('CurrentBookingCardClass');
    const title = await screen.findByTestId('BookingRoomTitle');
    expect(title).toHaveTextContent('Amor');
});

it('tests interaction with current booking expand button', async () => {
    jest.spyOn(bookingService, 'getBookings').mockImplementation(() => {
        return Promise.resolve(fakeBooking);
    });

    render(<CurrentBooking bookings={fakeBooking} />);

    const expansionButton = await screen.findByTestId('ExpansionButton');
    userEvent.click(expansionButton);
    expect(screen.getByText('4'));
});
