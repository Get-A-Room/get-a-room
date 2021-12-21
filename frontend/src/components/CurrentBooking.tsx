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
import { Booking, AddTimeDetails, Room } from '../types';
import { ExpandLess, ExpandMore, Group } from '@mui/icons-material';
import { updateBooking, deleteBooking } from '../services/bookingService';
import TimeLeft, { getTimeLeft } from './util/TimeLeft';
import useCreateNotification from '../hooks/useCreateNotification';

function getBookingRoomName(booking: Booking) {
    return booking.room.name;
}

function getEndTime(booking: Booking) {
    return booking.endTime;
}

function convertH2M(time: string) {
    time = time.replace(' h ', ':');
    let timeParts = time.split(':');
    return Number(timeParts[0]) * 60 + Number(timeParts[1]);
}

function getBookingTimeLeft(booking: Booking) {
    let timeLeft = getTimeLeft(getEndTime(booking));
    let availableFor = getTimeLeft(getNextCalendarEvent(booking.room));

    // Slice min string away
    timeLeft = timeLeft.slice(0, -3);
    availableFor = availableFor.slice(0, -3);

    let timeLeftMin: number;
    let availableForMin: number;

    // Convert to h:mm or mm
    if (timeLeft.includes(' h ')) {
        timeLeftMin = convertH2M(timeLeft);
    } else {
        timeLeftMin = +timeLeft;
    }

    // Convert to h:mm or mm
    if (availableFor.includes(' h ')) {
        availableForMin = convertH2M(availableFor);
    } else {
        availableForMin = +availableFor;
    }

    return availableForMin - timeLeftMin;
}

function getNextCalendarEvent(room: Room) {
    return room.nextCalendarEvent;
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
    updateRooms: () => void;
    updateBookings: () => void;
};

const CurrentBooking = (props: CurrentBookingProps) => {
    const { bookings, setBookings, updateRooms, updateBookings } = props;

    const { createSuccessNotification, createErrorNotification } =
        useCreateNotification();

    const [expandedFeatures, setExpandedFeatures] = useState('false');
    const [bookingProcessing, setBookingProcessing] = useState('false');

    const handleFeaturesCollapse = (booking: Booking) => {
        setExpandedFeatures(
            expandedFeatures === booking.id ? 'false' : booking.id
        );
    };

    // Get the next booking time in the reserved room
    const getNextCalendarEvent = (booking: Booking) => {
        return booking.room.nextCalendarEvent;
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
                updateBookings();
                createSuccessNotification('Time added to booking');
                window.scrollTo(0, 0);
            })
            .catch(() => {
                setBookingProcessing('false');
                createErrorNotification('Could not add time to booking');
            });
    };

    // Delete booking and add the room back to the available rooms list
    const handleDeleteBooking = (booking: Booking) => {
        setBookingProcessing(booking.id);

        deleteBooking(booking.id)
            .then(() => {
                setBookingProcessing('false');
                setBookings(bookings.filter((b) => b.id !== booking.id));
                createSuccessNotification('Booking deleted succesfully');

                updateRooms();
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
                                <Box>
                                    {getNextCalendarEvent(booking) !== '-1' ? (
                                        <TimeLeft
                                            endTime={getNextCalendarEvent(
                                                booking
                                            )}
                                            timeLeftText="Available for: "
                                        />
                                    ) : (
                                        <Typography>Available for:</Typography>
                                    )}
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
                            <Box flexDirection="column">
                                {isNaN(getBookingTimeLeft(booking)) ||
                                getBookingTimeLeft(booking) > 15 ? (
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
                                                    handleAddExtraTime(
                                                        booking,
                                                        15
                                                    )
                                                }
                                            >
                                                +15 min
                                            </Button>
                                        </CardActions>
                                    </Box>
                                ) : null}
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
                        {getFeatures(booking).length > 0 ? (
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
                                        <Typography
                                            style={{ fontSize: '16px' }}
                                        >
                                            {getFeatures(booking)}
                                        </Typography>
                                    </Box>
                                </Collapse>
                            </CardContent>
                        ) : null}
                    </Card>
                ))}
            </List>
        </div>
    );
};

export default CurrentBooking;
