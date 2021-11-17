import React from 'react';
import {
    Button,
    List,
    Card,
    CardActions,
    CardContent,
    Typography,
    IconButton,
    Collapse,
    Box,
    CircularProgress
} from '@mui/material';
import { Group, ExpandMore, ExpandLess } from '@mui/icons-material';
import './BookingView.css';
import { Booking, BookingDetails, Room } from '../types';
import { getBookings, makeBooking } from '../services/bookingService';

let bookingLoading_: String = 'false';

export async function book(
    event: React.MouseEvent<HTMLElement>,
    room: Room,
    duration: number,
    setBookings: React.Dispatch<React.SetStateAction<Booking[]>>
) {
    let bookingDetails: BookingDetails = {
        duration: duration,
        title: 'Reservation from Get a Room!',
        roomId: room.email
    };

    bookingLoading(room.id);

    makeBooking(bookingDetails)
        .then(() => {
            getBookings().then(setBookings);
            window.scrollTo(0, 0);
            bookingLoading('false');
            alert('Booking successful!');
        })
        .catch(() => {
            alert('Booking failed.');
        });
}

function disableBooking(bookings: Booking[]) {
    return bookings.length === 0 ? false : true;
}

function bookingLoading(roomId: String) {
    bookingLoading_ = roomId;
    return bookingLoading_;
}

function getName(room: Room) {
    return room.name;
}

function getCapacity(room: Room) {
    return room.capacity;
}

function getFeatures(room: Room) {
    let features = room.features;
    let featuresDisplay = [];

    // Format room features
    if (features) {
        for (let i = 0; i < features.length; i++) {
            featuresDisplay.push(features[i]);
            if (i !== features.length - 1) {
                featuresDisplay.push(', ');
            }
        }
    }
    return featuresDisplay;
}

type BookingListProps = {
    rooms: Room[];
    bookings: Booking[];
    setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
};

const AvailableRoomList = (props: BookingListProps) => {
    const { rooms, bookings, setBookings } = props;

    const [expandedFeatures, setExpandedFeatures] = React.useState('false');
    const [expandedBooking, setExpandedBooking] = React.useState('false');

    const handleFeaturesCollapse = (
        event: React.MouseEvent<HTMLElement>,
        room: Room
    ) => {
        setExpandedFeatures(expandedFeatures === room.id ? 'false' : room.id);
    };

    const handleBookingCollapse = (
        event: React.MouseEvent<HTMLElement>,
        room: Room
    ) => {
        setExpandedBooking(expandedBooking === room.id ? 'false' : room.id);
    };

    return (
        <div>
            <div className="AvailableRoomList">
                <List>
                    {rooms.map((room) => (
                        <Card
                            data-testid="AvailableRoomListCard"
                            className="AvailableRoomListCardClass"
                            key={room.id}
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
                                <Box
                                    style={{
                                        justifyContent: 'space-between',
                                        display: 'flex'
                                    }}
                                >
                                    <Typography
                                        data-testid="BookingRoomTitle"
                                        style={{
                                            fontSize: '18px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {getName(room)}
                                    </Typography>
                                    <CardActions disableSpacing>
                                        {!disableBooking(bookings) ? (
                                            <Button
                                                id="quickBook-button"
                                                data-testid="QuickBookButton"
                                                style={{
                                                    backgroundColor: '#282c34',
                                                    textTransform: 'none',
                                                    color: 'white',
                                                    fontSize: '16px',
                                                    animation:
                                                        'ripple 600ms linear',
                                                    minWidth: '130px',
                                                    minHeight: '50px',
                                                    maxWidth: '130px',
                                                    maxHeight: '50px'
                                                }}
                                                onClick={(e) =>
                                                    handleBookingCollapse(
                                                        e,
                                                        room
                                                    )
                                                }
                                                aria-label="Expand"
                                            >
                                                Quick Book
                                                {expandedBooking === room.id ? (
                                                    <ExpandLess />
                                                ) : (
                                                    <ExpandMore />
                                                )}
                                            </Button>
                                        ) : (
                                            <Button
                                                id="disabledQuickBook-button"
                                                data-testid="disabledQuickBookButton"
                                                style={{
                                                    backgroundColor: '#282c34',
                                                    textTransform: 'none',
                                                    color: '#A9A9A9',
                                                    fontSize: '16px',
                                                    minWidth: '130px',
                                                    minHeight: '50px',
                                                    maxWidth: '130px',
                                                    maxHeight: '50px'
                                                }}
                                                disabled={true}
                                            >
                                                Quick Book
                                            </Button>
                                        )}
                                    </CardActions>
                                </Box>
                                {bookingLoading_ === room.id ? (
                                    <div className="Booking-loadingScreen">
                                        <CircularProgress
                                            style={{ color: '#F04E30' }}
                                        />
                                    </div>
                                ) : null}
                                {expandedBooking === room.id ? (
                                    <Box
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Collapse
                                            in={expandedBooking === room.id}
                                            timeout="auto"
                                            unmountOnExit
                                        >
                                            <Box>
                                                <Button
                                                    id="book30Min-button"
                                                    style={{
                                                        backgroundColor:
                                                            '#282c34',
                                                        textTransform: 'none',
                                                        flex: '1 0 auto',
                                                        margin: '0 10px',
                                                        color: 'white',
                                                        fontSize: '16px',
                                                        animation:
                                                            'ripple 600ms linear',
                                                        minWidth: '100px',
                                                        minHeight: '50px',
                                                        maxWidth: '120px',
                                                        maxHeight: '50px'
                                                    }}
                                                    onClick={(e) => {
                                                        book(
                                                            e,
                                                            room,
                                                            30,
                                                            setBookings
                                                        );
                                                        handleBookingCollapse(
                                                            e,
                                                            room
                                                        );
                                                    }}
                                                >
                                                    30 min
                                                </Button>
                                                <Button
                                                    id="book60Min-button"
                                                    style={{
                                                        backgroundColor:
                                                            '#282c34',
                                                        textTransform: 'none',
                                                        flex: '1 0 auto',
                                                        margin: '0 10px',
                                                        color: 'white',
                                                        fontSize: '16px',
                                                        animation:
                                                            'ripple 600ms linear',
                                                        minWidth: '100px',
                                                        minHeight: '50px',
                                                        maxWidth: '120px',
                                                        maxHeight: '50px'
                                                    }}
                                                    onClick={(e) => {
                                                        book(
                                                            e,
                                                            room,
                                                            60,
                                                            setBookings
                                                        );
                                                        handleBookingCollapse(
                                                            e,
                                                            room
                                                        );
                                                    }}
                                                >
                                                    60 min
                                                </Button>
                                            </Box>
                                        </Collapse>
                                    </Box>
                                ) : null}
                                <div>
                                    <Box
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            maxHeight: '10px'
                                        }}
                                    >
                                        <CardActions disableSpacing>
                                            <IconButton
                                                data-testid="ExpansionButtonAvailableRoomList"
                                                onClick={(e) =>
                                                    handleFeaturesCollapse(
                                                        e,
                                                        room
                                                    )
                                                }
                                                aria-label="Expand"
                                            >
                                                {expandedFeatures ===
                                                room.id ? (
                                                    <ExpandLess />
                                                ) : (
                                                    <ExpandMore />
                                                )}
                                            </IconButton>
                                        </CardActions>
                                    </Box>
                                    <Collapse
                                        in={expandedFeatures === room.id}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <Box
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'left',
                                                maxHeight: '20px'
                                            }}
                                        >
                                            <Group />
                                            <Typography
                                                style={{ maxWidth: '2px' }}
                                            >
                                                {' '}
                                            </Typography>
                                            <Typography
                                                style={{
                                                    fontSize: '16px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {getCapacity(room)}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography
                                                style={{ fontSize: '16px' }}
                                            >
                                                {getFeatures(room)}
                                            </Typography>
                                        </Box>
                                    </Collapse>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </List>
            </div>
        </div>
    );
};

export default AvailableRoomList;
