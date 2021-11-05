import './CurrentBooking.css';
import { Card, CardContent, List, Typography } from '@mui/material';
import { Booking } from '../types';
import { useState, useEffect } from 'react';
import { getBookings } from '../services/bookingService';

function getBookingRoomName(booking: Booking) {
    return booking.room.name;
}

function getBookingTimeLeft(booking: Booking) {
    let endTime = new Date(Date.parse(booking.endTime));
    return getTimeDifference(endTime, new Date());
}

function getTimeDifference(startTime: Date, endTime: Date) {
    return Math.floor((startTime.getTime() - endTime.getTime()) / 1000 / 60);
}

function areBookingsFetched(bookings: Booking[]) {
    return Array.isArray(bookings) && bookings.length > 0;
}

function CurrentBooking() {
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        getBookings().then(setBookings);
    }, []);

    return !areBookingsFetched(bookings) ? null : (
        <div className="CurrentBooking">
            <header className="CurrentBooking-header">
                <h1>Your Booking</h1>
            </header>
            <List>
                {bookings.map((booking) => (
                    <Card
                        key={booking.id}
                        sx={{
                            background:
                                'linear-gradient(to right bottom, #c9c9c9, #969696)',
                            backgroundColor: '#c9c9c9',
                            border: 'success',
                            borderRadius: 3,
                            boxShadow: '5px 5px #bcbcbc',
                            m: 2
                        }}
                    >
                        <CardContent
                            style={{
                                textAlign: 'left',
                                paddingLeft: '1.5em'
                            }}
                        >
                            <Typography
                                style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {' '}
                                {getBookingRoomName(booking)}{' '}
                            </Typography>
                            <Typography
                                style={{
                                    fontStyle: 'italic'
                                }}
                            >
                                Time left: {getBookingTimeLeft(booking)} min
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </List>
        </div>
    );
}

export default CurrentBooking;
