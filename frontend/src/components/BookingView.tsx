import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import './BookingView.css';
import { getRooms } from '../services/roomService';
import { getBookings } from '../services/bookingService';
import { Room, Booking, Preferences } from '../types';
import CurrentBooking from './CurrentBooking';
import AvailableRoomList from './AvailableRoomList';

// Check if rooms are fetched
function areRoomsFetched(rooms: Room[]) {
    return Array.isArray(rooms) && rooms.length > 0;
}

type BookingViewProps = {
    preferences?: Preferences;
};

function BookingView(props: BookingViewProps) {
    const { preferences } = props;

    const [rooms, setRooms] = useState<Room[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        if (preferences) {
            const buildingPreference = preferences.building?.id;
            getRooms(buildingPreference)
                .then(setRooms)
                .catch((error) => console.log(error));
        }
    }, [preferences]);

    useEffect(() => {
        getBookings()
            .then(setBookings)
            .catch((error) => console.log(error));
    }, []);

    return (
        <div>
            <CurrentBooking bookings={bookings} />
            <div className="BookingView">
                <header className="BookingView-header">
                    <h1>Available rooms</h1>
                </header>
                {!areRoomsFetched(rooms) ? (
                    <div className="BookingView-loadingScreen">
                        <CircularProgress style={{ color: '#F04E30' }} />
                    </div>
                ) : (
                    <AvailableRoomList
                        rooms={rooms}
                        setBookings={setBookings}
                    />
                )}
            </div>
        </div>
    );
}

export default BookingView;
