import React, { useState } from 'react';
import {
    Box,
    Card,
    CardActions,
    CardContent,
    Collapse,
    IconButton,
    List,
    Typography,
    Button,
    CircularProgress
} from '@mui/material';
import { getRooms } from '../services/roomService';
import { Room, Booking, AddTimeDetails, Preferences } from '../types';
import { ExpandLess, ExpandMore, Group } from '@mui/icons-material';
import { updateBooking, deleteBooking } from '../services/bookingService';
import TimeLeft from './util/TimeLeft';
import useCreateNotification from '../hooks/useCreateNotification';

function getBookingRoomName(booking: Booking) {
    return booking.room.name;
}

function getEndTime(booking: Booking) {
    return booking.endTime;
}

function areBookingsFetched(bookings: Booking[]) {
    return Array.isArray(bookings) && bookings.length > 0;
}

function getCapacity(booking: Booking) {
    return booking.room.capacity;
}

function getFeatures(booking: Booking) {
    let featureArray = booking.room.features;
    let featuresDisplay = [];

    // Format booking.room features
    if (featureArray) {
        for (let feature = 0; feature < featureArray.length; feature++) {
            featuresDisplay.push(featureArray[feature]);
            if (feature !== featureArray.length - 1) {
                featuresDisplay.push(', ');
            }
        }
    }
    return featuresDisplay;
}

type CurrentBookingProps = {
    bookings: Booking[];
    setRooms: (rooms: Room[]) => void;
    setBookings: (bookings: Booking[]) => void;
    preferences?: Preferences;
};

const CurrentBooking = (props: CurrentBookingProps) => {
    const { bookings, setRooms, setBookings, preferences } = props;

    const { createSuccessNotification, createErrorNotification } =
        useCreateNotification();

    const [expandedFeatures, setExpandedFeatures] = useState('false');
    const [bookingProcessing, setBookingProcessing] = useState('false');

    const handleFeaturesCollapse = (booking: Booking) => {
        setExpandedFeatures(
            expandedFeatures === booking.id ? 'false' : booking.id
        );
    };

    // Add extra time for the reserved room
    const handleAddExtraTime = (booking: Booking, minutes: number) => {
        let addTimeDetails: AddTimeDetails = {
            timeToAdd: minutes
        };

        setBookingProcessing(booking.id);

        updateBooking(addTimeDetails, booking.id)
            .then((updatedBooking) => {
                setBookingProcessing('false');
                // replace updated booking
                setBookings(
                    bookings.map((b) =>
                        b.id === booking.id ? updatedBooking : b
                    )
                );
                createSuccessNotification('Time added to booking');
                window.scrollTo(0, 0);
            })
            .catch(() => {
                setBookingProcessing('false');
                createErrorNotification('Could not add time to booking');
            });
    };

    const handleDeleteBooking = (booking: Booking) => {
        setBookingProcessing(booking.id);

        deleteBooking(booking.id)
            .then(() => {
                setBookingProcessing('false');
                setBookings(bookings.filter((b) => b.id !== booking.id));
                createSuccessNotification('Booking deleted succesfully');

                if (preferences) {
                    const buildingPreference = preferences.building?.id;
                    getRooms(buildingPreference)
                        .then(setRooms)
                        .catch((error) => console.log(error));
                }
            })
            .catch(() => {
                setBookingProcessing('false');
                createErrorNotification('Could not delete booking');
            });
    };

    if (!areBookingsFetched(bookings)) {
        return null;
    }

    return (
        <div id="current-booking">
            <Typography py={2} textAlign="center" variant="h4">
                Your Booking
            </Typography>
            <List>
                {bookings.map((booking) => (
                    <Card
                        data-testid="CurrentBookingCard"
                        className="CurrentBookingCardClass"
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
                                        alignItems: 'center'
                                    }}
                                >
                                    <Group sx={{ pb: 0.3 }} />
                                    <Typography
                                        sx={{
                                            fontSize: '18px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {getCapacity(booking)}
                                    </Typography>
                                    <Typography
                                        data-testid="BookingRoomTitle"
                                        sx={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            ml: 1
                                        }}
                                    >
                                        {getBookingRoomName(booking)}
                                    </Typography>
                                </Box>
                                <Box>
                                    <TimeLeft
                                        endTime={getEndTime(booking)}
                                        timeLeftText="Time left:"
                                    />
                                </Box>
                                {bookingProcessing === booking.id ? (
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        mt={3}
                                    >
                                        <CircularProgress color="primary" />
                                    </Box>
                                ) : null}
                            </Box>
                            <Box display="flex" flexDirection="column">
                                <Box
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        alignItems: 'right'
                                    }}
                                >
                                    <CardActions disableSpacing>
                                        <Button
                                            id="extraTime-button"
                                            data-testid="ExtraTimeButton"
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
                                                handleAddExtraTime(booking, 15)
                                            }
                                        >
                                            +15 min
                                        </Button>
                                    </CardActions>
                                </Box>
                                <Box
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        alignItems: 'right'
                                    }}
                                >
                                    <CardActions disableSpacing>
                                        <Button
                                            id="delete-button"
                                            data-testid="DeleteButton"
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
                                                handleDeleteBooking(booking)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </CardActions>
                                </Box>
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
                            <Box
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    maxHeight: '10px'
                                }}
                            >
                                <CardActions disableSpacing>
                                    <IconButton
                                        data-testid="ExpansionButton"
                                        onClick={() =>
                                            handleFeaturesCollapse(booking)
                                        }
                                        aria-label="Expand"
                                    >
                                        {expandedFeatures === booking.id ? (
                                            <ExpandLess />
                                        ) : (
                                            <ExpandMore />
                                        )}
                                    </IconButton>
                                </CardActions>
                            </Box>
                            <Collapse
                                in={expandedFeatures === booking.id}
                                timeout="auto"
                                unmountOnExit
                            >
                                <Box mt={2}>
                                    <Typography style={{ fontSize: '16px' }}>
                                        {getFeatures(booking)}
                                    </Typography>
                                </Box>
                            </Collapse>
                        </CardContent>
                    </Card>
                ))}
            </List>
        </div>
    );
};

export default CurrentBooking;
