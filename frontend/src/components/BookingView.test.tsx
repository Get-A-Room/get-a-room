// @ts-nocheck
import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { render, screen, waitFor } from '@testing-library/react';
import BookingView from './BookingView';
import NavBar from './NavBar';
import * as bookingService from '../services/bookingService';
import { getBookings } from '../services/bookingService';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        pathname: '/login'
    })
}));

describe('<NavBar />', () => {
    it('should render NavBar', () => {
        render(<NavBar />);
    });
});

it('renders BookingView.tsx', () => {
    const div = document.createElement('div');
    ReactDOM.render(<BookingView></BookingView>, div);
});

let container = null;
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

    render(<BookingView />, container);

    const items = screen.queryByTestId('BookingViewCard');
    waitFor(() => expect(items).toHaveClass('BookingViewCardClass'));

    const title = screen.queryByTestId('BookingRoomTitle');
    waitFor(() => expect(title).toHaveTextContent('Amor'));
});
