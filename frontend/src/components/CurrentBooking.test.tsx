// @ts-nocheck
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CurrentBooking from './CurrentBooking';
import userEvent from '@testing-library/user-event';
import { unmountComponentAtNode } from 'react-dom';
import useCreateNotification from '../hooks/useCreateNotification';

jest.mock('../hooks/useCreateNotification', () => () => {
    return {
        createSuccessNotification: jest.fn(),
        createErrorNotification: jest.fn()
    };
});

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

let container = null;
describe('CurrentBooking', () => {
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

    it('renders booking data with correct name', async () => {
        render(<CurrentBooking bookings={fakeBooking} />, container);
        const items = await screen.queryByTestId('CurrentBookingCard');
        await waitFor(() =>
            expect(items).toHaveClass('CurrentBookingCardClass')
        );
        const title = await screen.queryByTestId('BookingRoomTitle');
        await waitFor(() => expect(title).toHaveTextContent('Amor'));
    });

    it('shows capacity after expanding', async () => {
        render(<CurrentBooking bookings={fakeBooking} />, container);
        const expansionButton = await screen.queryByTestId('ExpansionButton');
        userEvent.click(expansionButton);
        await waitFor(() => expect(screen.getByText('4')));
    });
});
