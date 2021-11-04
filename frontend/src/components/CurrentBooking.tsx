import './CurrentBooking.css';
import { Card, CardContent, Typography } from '@mui/material';
import { Booking } from '../types';

function getBookingRoomName(booking: Booking) {
    return booking.room.name;
}

function getBookingTimeLeft() {
    const test = '2021-11-04T13:32:28Z';
    let endTime = new Date(Date.parse(test));

    return getTimeDifference(endTime, new Date());
}

function getTimeUntilNextBooking() {
    const test = '2021-11-03T18:32:28Z';
    let newBooking = new Date(Date.parse(test));

    return getTimeDifference(newBooking, new Date());
}

function getTimeDifference(startTime: Date, endTime: Date) {
    return Math.floor((startTime.getTime() - endTime.getTime()) / 1000 / 60);
}

function areBookingsFetched(bookings: Booking[]) {
    return Array.isArray(bookings) && bookings.length > 0;
}

function CurrentBooking() {
    return (
        <div className="CurrentBooking">
            <header className="CurrentBooking-header">
                <h1>Your Booking</h1>
            </header>
            <Card
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
                <CardContent>
                    <Typography> Amor </Typography>
                    <Typography>
                        Time left: {getBookingTimeLeft()} min
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}

export default CurrentBooking;
