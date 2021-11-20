import React, { useState } from 'react';
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
import { makeBooking } from '../services/bookingService';
import TimeLeft from './util/TimeLeft';
import { Booking, BookingDetails, Room } from '../types';
import useCreateNotification from '../hooks/useCreateNotification';

function disableBooking(bookings: Booking[]) {
    return bookings.length === 0 ? false : true;
}

function getNextCalendarEvent(room: Room) {
    return room.nextCalendarEvent;
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
    setRooms: (rooms: Room[]) => void;
    bookings: Booking[];
    setBookings: (bookings: Booking[]) => void;
};

const AvailableRoomList = (props: BookingListProps) => {
    const { rooms, setRooms, bookings, setBookings } = props;

    const { createSuccessNotification, createErrorNotification } =
        useCreateNotification();

    const [bookingLoading, setBookingLoading] = useState('false');
    const [expandedFeatures, setExpandedFeatures] = useState('false');
    const [expandedBooking, setExpandedBooking] = useState('false');

    const handleFeaturesCollapse = (room: Room) => {
        setExpandedFeatures(expandedFeatures === room.id ? 'false' : room.id);
    };

    const handleBookingCollapse = (room: Room) => {
        setExpandedBooking(expandedBooking === room.id ? 'false' : room.id);
    };

    const book = (room: Room, duration: number) => {
        let bookingDetails: BookingDetails = {
            duration: duration,
            title: 'Reservation from Get a Room!',
            roomId: room.id
        };

        setBookingLoading(room.id);

        makeBooking(bookingDetails)
            .then((madeBooking) => {
                setBookings([...bookings, madeBooking]);
                setRooms(rooms.filter((r) => r.id !== room.id));
                createSuccessNotification('Booking was succesful');
                setBookingLoading('false');
                window.scrollTo(0, 0);
            })
            .catch(() => {
                createErrorNotification('Could not create booking');
                setBookingLoading('false');
            });
    };
    return (
        <Box id="available-room-list" textAlign="center">
            <List>
                {rooms
                    .sort((a, b) => (a.name < b.name ? -1 : 1))
                    .map((room) => (
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
                            <CardContent
                                style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'column',
                                    display: 'flex',
                                    textAlign: 'left'
                                }}
                            >
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <Box display="flex" flexDirection="column">
                                        <Typography
                                            data-testid="BookingRoomTitle"
                                            style={{
                                                fontSize: '18px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {getName(room)}
                                        </Typography>
                                        <TimeLeft
                                            endTime={getNextCalendarEvent(room)}
                                            timeLeftText="Free for: "
                                        />
                                    </Box>
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
                                                onClick={() =>
                                                    handleBookingCollapse(room)
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
                                                    backgroundColor: '#333842',
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
                                {bookingLoading === room.id ? (
                                    <Box
                                        py={2}
                                        display="flex"
                                        justifyContent="center"
                                    >
                                        <CircularProgress color="primary" />
                                    </Box>
                                ) : null}
                                {expandedBooking === room.id ? (
                                    <Collapse
                                        in={expandedBooking === room.id}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-evenly',
                                                mb: 2
                                            }}
                                        >
                                            <Button
                                                id="book30Min-button"
                                                style={{
                                                    backgroundColor: '#282c34',
                                                    textTransform: 'none',
                                                    color: 'white',
                                                    fontSize: '16px',
                                                    animation:
                                                        'ripple 600ms linear',
                                                    minWidth: '100px',
                                                    minHeight: '50px',
                                                    maxWidth: '120px',
                                                    maxHeight: '50px'
                                                }}
                                                onClick={() => {
                                                    book(room, 30);
                                                    handleBookingCollapse(room);
                                                }}
                                            >
                                                30 min
                                            </Button>
                                            <Button
                                                id="book60Min-button"
                                                style={{
                                                    backgroundColor: '#282c34',
                                                    textTransform: 'none',
                                                    color: 'white',
                                                    fontSize: '16px',
                                                    animation:
                                                        'ripple 600ms linear',
                                                    minWidth: '100px',
                                                    minHeight: '50px',
                                                    maxWidth: '120px',
                                                    maxHeight: '50px'
                                                }}
                                                onClick={() => {
                                                    book(room, 60);
                                                    handleBookingCollapse(room);
                                                }}
                                            >
                                                60 min
                                            </Button>
                                        </Box>
                                    </Collapse>
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
                                                onClick={() =>
                                                    handleFeaturesCollapse(room)
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
        </Box>
    );
};

export default AvailableRoomList;
