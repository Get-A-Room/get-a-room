import './CurrentBooking.css';
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
    Button
} from '@mui/material';
import { Booking } from '../types';
import React from 'react';
import { ExpandLess, ExpandMore, Group } from '@mui/icons-material';

// Add extra time for the reserved room
function addExtraTime(event: React.MouseEvent<HTMLElement>, booking: Booking) {
    // TODO
}

// Delete reserved booking
function deleteBooking(event: React.MouseEvent<HTMLElement>, booking: Booking) {
    // TODO
}

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

function CurrentBooking({ bookings }: { bookings: Booking[] }) {
    const [expandedFeatures, setExpandedFeatures] = React.useState('false');

    const handleFeaturesCollapse = (
        event: React.MouseEvent<HTMLElement>,
        booking: Booking
    ) => {
        setExpandedFeatures(
            expandedFeatures === booking.id ? 'false' : booking.id
        );
    };

    if (!areBookingsFetched(bookings)) {
        return null;
    }

    return (
        <div className="CurrentBooking">
            <header className="CurrentBooking-header">
                <h1>Your Booking</h1>
            </header>
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
                                    </Box>
                                    <Box
                                        style={{
                                            textAlign: 'left'
                                        }}
                                    >
                                        <Typography
                                            style={{ fontStyle: 'italic' }}
                                        >
                                            Time left:{' '}
                                            {getBookingTimeLeft(booking)} min
                                        </Typography>
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
                                        onClick={(e) =>
                                            addExtraTime(e, booking)
                                        }
                                    >
                                        +15 min
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography> </Typography>
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
                                            onClick={(e) =>
                                                deleteBooking(e, booking)
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
                                        onClick={(e) =>
                                            handleFeaturesCollapse(e, booking)
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
}

export default CurrentBooking;
