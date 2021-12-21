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
    CircularProgress,
    Switch,
    FormControlLabel
} from '@mui/material';
import { Group, ExpandMore, ExpandLess } from '@mui/icons-material';
import { makeBooking } from '../services/bookingService';
import TimeLeft, { getTimeLeft } from './util/TimeLeft';
import { Booking, BookingDetails, Room } from '../types';
import useCreateNotification from '../hooks/useCreateNotification';

function disableBooking(bookings: Booking[]) {
    return bookings.length === 0 ? false : true;
}

function getBookingTimeLeft(room: Room) {
    let timeLeft = getTimeLeft(getNextCalendarEvent(room));
    timeLeft = timeLeft.slice(0, -3);
    return Number(timeLeft);
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
    bookings: Booking[];
    updateData: () => void;
};

const AvailableRoomList = (props: BookingListProps) => {
    const { rooms, bookings, updateData } = props;

    const { createSuccessNotification, createErrorNotification } =
        useCreateNotification();

    const [bookingLoading, setBookingLoading] = useState('false');
    const [expandedFeatures, setExpandedFeatures] = useState([] as string[]);
    const [expandedFeaturesAll, setExpandedFeaturesAll] = useState(
        false as boolean
    );
    const [expandedBooking, setExpandedBooking] = useState('false');

    const handleFeaturesCollapse = (room: Room) => {
        if (expandedFeatures.includes(room.id)) {
            // Collapse
            expandedFeatures.forEach((element: any, index: any) => {
                if (element === room.id) expandedFeatures.splice(index, 1);
            });
            setExpandedFeatures((expandedFeatures: any) => [
                ...expandedFeatures
            ]);
        } else {
            // Expand
            setExpandedFeatures((expandedFeatures: any) => [
                ...expandedFeatures,
                room.id
            ]);
        }
    };

    const handleAllFeaturesCollapse = () => {
        setExpandedFeaturesAll(!expandedFeaturesAll);
        setExpandedFeatures([]);
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
                updateData();
                createSuccessNotification('Booking was succesful');
                setBookingLoading('false');
                document.getElementById('main-view-content')?.scrollTo(0, 0);
            })
            .catch(() => {
                createErrorNotification('Could not create booking');
                setBookingLoading('false');
            });
    };
    return (
        <Box id="available-room-list" textAlign="center" pb={8}>
            <FormControlLabel
                label={
                    <Typography
                        sx={{
                            fontSize: '18px',
                            fontWeight: 'bold'
                        }}
                    >
                        Expand room features
                    </Typography>
                }
                control={<Switch onChange={handleAllFeaturesCollapse} />}
            />
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
                                    display: 'flex',
                                    textAlign: 'left'
                                }}
                            >
                                <Box display="flex" flexDirection="column">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'left',
                                            alignItems: 'center',
                                            pt: 0.9
                                        }}
                                    >
                                        <Group sx={{ pb: 0.3 }} />
                                        <Typography
                                            sx={{
                                                fontSize: '18px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {getCapacity(room)}
                                        </Typography>
                                        <Typography
                                            data-testid="BookingRoomTitle"
                                            sx={{
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                                ml: 1
                                            }}
                                        >
                                            {getName(room)}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <TimeLeft
                                            endTime={getNextCalendarEvent(room)}
                                            timeLeftText="Free for: "
                                        />
                                    </Box>
                                </Box>
                                <Box>
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
                                        ) : null}
                                    </CardActions>
                                </Box>
                            </CardContent>
                            <CardContent
                                style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'column',
                                    display: 'flex',
                                    textAlign: 'center'
                                }}
                            >
                                {bookingLoading === room.id ? (
                                    <Box
                                        pb={2}
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
                                                data-testid="Book30MinButton"
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
                                            {isNaN(getBookingTimeLeft(room)) ||
                                            getBookingTimeLeft(room) >= 60 ? (
                                                <Button
                                                    id="book60Min-button"
                                                    data-testid="Book60MinButton"
                                                    style={{
                                                        backgroundColor:
                                                            '#282c34',
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
                                                        handleBookingCollapse(
                                                            room
                                                        );
                                                    }}
                                                >
                                                    60 min
                                                </Button>
                                            ) : null}
                                        </Box>
                                    </Collapse>
                                ) : null}
                                {getFeatures(room).length > 0 &&
                                !expandedFeaturesAll ? (
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
                                                {expandedFeatures.includes(
                                                    room.id
                                                ) ? (
                                                    <ExpandLess />
                                                ) : (
                                                    <ExpandMore />
                                                )}
                                            </IconButton>
                                        </CardActions>
                                    </Box>
                                ) : null}
                                <Collapse
                                    in={
                                        expandedFeatures.includes(room.id) ||
                                        expandedFeaturesAll
                                    }
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <Box mt={2}>
                                        <Typography
                                            style={{ fontSize: '16px' }}
                                        >
                                            {getFeatures(room)}
                                        </Typography>
                                    </Box>
                                </Collapse>
                            </CardContent>
                        </Card>
                    ))}
            </List>
        </Box>
    );
};

export default AvailableRoomList;
