import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { getRooms } from '../services/roomService';
import { getBookings } from '../services/bookingService';
import { Room, Booking, Preferences } from '../types';
import CurrentBooking from './CurrentBooking';
import AvailableRoomList from './AvailableRoomList';
import CenteredProgress from './util/CenteredProgress';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Check if rooms are fetched
function areRoomsFetched(rooms: Room[]) {
    return Array.isArray(rooms) && rooms.length > 0;
}

function isActiveBooking(bookings: Booking[]) {
    return bookings.length > 0;
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
        <div id="booking-view">
            <CurrentBooking
                bookings={bookings}
                setRooms={setRooms}
                setBookings={setBookings}
                preferences={preferences}
            />
            <Typography py={2} variant="h4" textAlign="center">
                Available rooms
            </Typography>
            {isActiveBooking(bookings) ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        py: 2,
                        px: 3
                    }}
                >
                    <ErrorOutlineIcon />
                    <Typography
                        sx={{
                            fontSize: '18px',
                            textAlign: 'center',
                            px: 1
                        }}
                    >
                        You cannot book a new room unless you remove your
                        current booking
                    </Typography>
                </Box>
            ) : null}
            {!areRoomsFetched(rooms) ? (
                <CenteredProgress />
            ) : (
                <AvailableRoomList
                    rooms={rooms}
                    setRooms={setRooms}
                    bookings={bookings}
                    setBookings={setBookings}
                />
            )}
        </div>
    );
}

export default BookingView;
