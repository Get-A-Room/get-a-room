// @ts-nocheck
import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { render, screen, waitFor } from '@testing-library/react';
import AvailableRoomList from './AvailableRoomList';
import NavBar from './NavBar';
import * as roomService from '../services/roomService';
//import * as bookingService from '../services/bookingService';
//import { makeBooking } from '../services/bookingService';
import userEvent from '@testing-library/user-event';

const fakeRooms = [
    {
        id: '123',
        name: 'Amor',
        building: 'Hermia 5',
        capacity: 15,
        features: ['TV', 'Whiteboard'],
        nextCalendarEvent: '2021-10-21T17:32:28Z',
        email: 'c_188fib500s84uis7kcpb6dfm93v25@resource.calendar.google.com'
    }
];

jest.mock('../hooks/useCreateNotification', () => () => {
    return {
        createSuccessNotification: jest.fn(),
        createErrorNotification: jest.fn()
    };
});

const fakeBookings = [];

let container = null;

describe('AvailableRoomList', () => {
    beforeEach(() => {
        // Setup a DOM element as a render target
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        // Cleanup on exiting
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });

    it('renders room data', async () => {
        render(
            <AvailableRoomList rooms={fakeRooms} bookings={fakeBookings} />,
            container
        );

        const items = screen.queryByTestId('AvailableRoomListCard');
        await waitFor(() =>
            expect(items).toHaveClass('AvailableRoomListCardClass')
        );

        const title = screen.queryByTestId('BookingRoomTitle');
        await waitFor(() => expect(title).toHaveTextContent('Amor'));
    });

    it('tests interaction with rooms expand button', async () => {
        render(
            <AvailableRoomList rooms={fakeRooms} bookings={fakeBookings} />,
            container
        );

        const expansionButton = await screen.findByTestId(
            'ExpansionButtonAvailableRoomList'
        );
        userEvent.click(expansionButton);
        await waitFor(() => expect(screen.getByText('15')));
    });

    it('tests interaction with quick book button', async () => {
        render(
            <AvailableRoomList rooms={fakeRooms} bookings={fakeBookings} />,
            container
        );

        const quickBookButton = await screen.findByTestId('QuickBookButton');
        userEvent.click(quickBookButton);
        await waitFor(() => expect(screen.getByText('30 min')));
        await waitFor(() => expect(screen.getByText('60 min')));
    });
});
