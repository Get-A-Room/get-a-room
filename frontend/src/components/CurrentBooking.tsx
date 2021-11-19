import {
    Box,
    Card,
    CardActions,
    CardContent,
    Collapse,
    Grid,
    IconButton,
    List,
    Typography
} from '@mui/material';
import { Booking } from '../types';
import React from 'react';
import { ExpandLess, ExpandMore, Group } from '@mui/icons-material';
import TimeLeft from './util/TimeLeft';

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
