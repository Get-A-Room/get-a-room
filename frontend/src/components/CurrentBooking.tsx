import './CurrentBooking.css';
import { Card, CardContent, Typography } from '@mui/material';
import { Booking } from '../types';

function getBookingRoomName(booking: Booking) {
    return booking.room.name;
}

function getBookingTimeLeft() {
    const test = '2021-11-01T14:32:28Z';
    let endTime = new Date(Date.parse(test));

    return getTimeDifference(endTime, new Date());
}

function getTimeUntilNextBooking() {
    const test = '2021-11-01T18:32:28Z';
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
            <Card>
                <CardContent>
                    <Typography> Amor </Typography>
                    <Typography>
                        Time left: {getBookingTimeLeft()} min
                    </Typography>
                    <Typography>
                        Room's next booking starts in{' '}
                        {getTimeUntilNextBooking()} min
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}

export default CurrentBooking;
