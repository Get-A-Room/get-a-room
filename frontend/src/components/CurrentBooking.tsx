import React, { useState } from 'react';
import {
    Box,
    Card,
    CardActions,
    CardContent,
    Collapse,
    Grid,
    IconButton,
    List,
    Typography,
    Button,
    CircularProgress
} from '@mui/material';
import { Booking, AddTimeDetails } from '../types';
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
    setBookings: (bookings: Booking[]) => void;
};

const CurrentBooking = (props: CurrentBookingProps) => {
    const { bookings, setBookings } = props;

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
                        <CardContent style={{ paddingBottom: 0 }}>
                            <Grid
                                container
                                spacing={2}
                                style={{
                                    alignItems: 'stretch',
                                    display: 'flex'
                                }}
                            >
                                <Grid item xs={6}>
                                    <Box
                                        style={{
                                            textAlign: 'left'
                                        }}
                                    >
                                        <Typography
                                            data-testid="BookingRoomTitle"
                                            style={{
                                                fontSize: '18px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {getBookingRoomName(booking)}
                                        </Typography>
                                        <TimeLeft
                                            endTime={getEndTime(booking)}
                                            timeLeftText="Time left:"
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button
                                        id="extraTime-button"
                                        data-testid="ExtraTimeButton"
                                        style={{
                                            backgroundColor: '#282c34',
                                            textTransform: 'none',
                                            color: 'white',
                                            fontSize: '16px',
                                            animation: 'ripple 600ms linear',
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
                                </Grid>
                                <Grid item xs={6}>
                                    {bookingProcessing === booking.id ? (
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                        >
                                            <CircularProgress color="primary" />
                                        </Box>
                                    ) : null}
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid item>
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
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Box
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingBottom: 0
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
                                <Grid
                                    container
                                    spacing={2}
                                    style={{
                                        display: 'flex',
                                        paddingBottom: '1em',
                                        justifyContent: 'space-around'
                                    }}
                                >
                                    <Grid item>
                                        <Box
                                            style={{
                                                display: 'flex'
                                            }}
                                        >
                                            <Group />
                                            <Typography
                                                style={{
                                                    fontSize: '16px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {getCapacity(booking)}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            style={{ fontSize: '16px' }}
                                        >
                                            {' '}
                                            {getFeatures(booking)}{' '}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Collapse>
                        </CardContent>
                    </Card>
                ))}
            </List>
        </div>
    );
};

export default CurrentBooking;
