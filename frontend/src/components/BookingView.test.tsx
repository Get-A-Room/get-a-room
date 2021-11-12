// @ts-nocheck
import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { render, screen, waitFor } from '@testing-library/react';
import BookingView from './BookingView';
import NavBar from './NavBar';
import * as roomService from '../services/roomService';
import { getRooms } from '../services/roomService';
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
