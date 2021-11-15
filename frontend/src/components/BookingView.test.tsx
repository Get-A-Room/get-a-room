// @ts-nocheck
import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { render, screen, waitFor } from '@testing-library/react';
import BookingView from './BookingView';
import NavBar from './NavBar';
import * as roomService from '../services/roomService';
//import * as bookingService from '../services/bookingService';
import { getRooms } from '../services/roomService';
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

/*
const fakeBookingDetails = {
    duration: 30,
    title: 'Reservation from Get a Room!',
    roomId: 'c_188fib500s84uis7kcpb6dfm93v25@resource.calendar.google.com'
};
*/

let container = null;

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

describe('BookingView', () => {
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
        jest.spyOn(roomService, 'getRooms').mockImplementation(() => {
            return Promise.resolve(fakeRooms);
        });

        render(<BookingView />, container);

        const items = screen.queryByTestId('BookingViewCard');
        waitFor(() => expect(items).toHaveClass('BookingViewCardClass'));

        const title = screen.queryByTestId('BookingRoomTitle');
        waitFor(() => expect(title).toHaveTextContent('Amor'));
    });

    it('tests interaction with rooms expand button', async () => {
        jest.spyOn(roomService, 'getRooms').mockImplementation(() => {
            return Promise.resolve(fakeRooms);
        });

        render(<BookingView />, container);

        const expansionButton = await screen.findByTestId(
            'ExpansionButtonBookingView'
        );
        userEvent.click(expansionButton);
        await waitFor(() => expect(screen.getByText('15')));
    });

    it('tests interaction with quick book button', async () => {
        jest.spyOn(roomService, 'getRooms').mockImplementation(() => {
            return Promise.resolve(fakeRooms);
        });

        render(<BookingView />, container);

        const quickBookButton = await screen.findByTestId('QuickBookButton');
        userEvent.click(quickBookButton);
        await waitFor(() => expect(screen.getByText('30 min')));
        await waitFor(() => expect(screen.getByText('60 min')));
    });

    /*
    it('tests interaction with booking', async () => {
        jest.spyOn(roomService, 'getRooms').mockImplementation(() => {
            return Promise.resolve(fakeRooms);
        });
        
        jest.spyOn(window, 'alert').mockImplementation(() => {});

        render(<BookingView />, container);

        const quickBookButton = await screen.findByTestId(
            'QuickBookButton'
        );

        userEvent.click(quickBookButton);

        const book30MinButton = await screen.findByTestId(
            'book30MinButton'
        );

        userEvent.click(book30MinButton);
        await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Booking successful!') ||
            (window.alert).toHaveBeenCalledWith('Booking failed.'));
    });
    */
});
