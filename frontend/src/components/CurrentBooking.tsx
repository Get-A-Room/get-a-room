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
    Snackbar,
    Alert,
    CircularProgress
} from '@mui/material';
import { Booking, AddTimeDetails } from '../types';
import React, { useState } from 'react';
import { ExpandLess, ExpandMore, Group } from '@mui/icons-material';
import { updateBooking, deleteBooking } from '../services/bookingService';

let updateLoading: String = 'false';

// Add extra time for the reserved room
export async function addExtraTime(
    event: React.MouseEvent<HTMLElement>,
    booking: Booking,
    setOpenSuccessAlert: React.Dispatch<React.SetStateAction<boolean>>,
    setOpenErrorAlert: React.Dispatch<React.SetStateAction<boolean>>
) {
    let addTimeDetails: AddTimeDetails = {
        timeToAdd: 15
    };

    updateLoading = booking.id;

    updateBooking(addTimeDetails, booking.id)
        .then(() => {
            updateLoading = 'false';
            setOpenSuccessAlert(true);
            window.scrollTo(0, 0);
        })
        .catch((e) => {
            updateLoading = 'false';
            setOpenErrorAlert(true);
        });
}

// Delete reserved booking
function deleteBookings(
    event: React.MouseEvent<HTMLElement>,
    booking: Booking
) {
    deleteBooking(booking.id).then(() => {});
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

type CurrentBookingProps = {
    bookings: Booking[];
};

const CurrentBooking = (props: CurrentBookingProps) => {
    const { bookings } = props;


    const [expandedFeatures, setExpandedFeatures] = useState('false');

    const { createSuccessNotification, createErrorNotification } =
        useCreateNotification();
    const [expandedFeatures, setExpandedFeatures] = useState('false');
    const [addTimeLoading, setAddTimeLoading] = useState('false');

    const handleFeaturesCollapse = (booking: Booking) => {
        setExpandedFeatures(
            expandedFeatures === booking.id ? 'false' : booking.id
        );
    };
    // Add extra time for the reserved room
    const addExtraTime = (booking: Booking, minutes: number) => {
        let addTimeDetails: AddTimeDetails = {
            timeToAdd: minutes
        };

        setAddTimeLoading(booking.id);

        updateBooking(addTimeDetails, booking.id)
            .then(() => {
                setAddTimeLoading('false');
                createSuccessNotification('Time added to booking');
                window.scrollTo(0, 0);
            })
            .catch(() => {
                setAddTimeLoading('false');
                createErrorNotification('Could not add time to booking');
            });
    };

    const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
    const [openErrorAlert, setOpenErrorAlert] = useState(false);

    const handleSuccessAlertClosure = () => {
        setOpenSuccessAlert(false);
    };
    const handleErrorAlertClosure = () => {
        setOpenErrorAlert(false);
    };

    if (!areBookingsFetched(bookings)) {
        return null;
    }

    return (
        <div className="CurrentBooking">
            <header className="CurrentBooking-header">
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Snackbar
                        open={openSuccessAlert}
                        autoHideDuration={5000}
                        onClose={handleSuccessAlertClosure}
                    >
                        <Alert severity="success">Update successful!</Alert>
                    </Snackbar>
                    <Snackbar
                        open={openErrorAlert}
                        autoHideDuration={5000}
                        onClose={handleErrorAlertClosure}
                    >
                        <Alert severity="error">Update failed.</Alert>
                    </Snackbar>
                </Box>
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
                                            addExtraTime(
                                                e,
                                                booking,
                                                setOpenSuccessAlert,
                                                setOpenErrorAlert
                                            )
                                        }
                                    >
                                        +15 min
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    {updateLoading === booking.id ? (
                                        <div className="Update-loadingScreen">
                                            <CircularProgress
                                                style={{ color: '#F04E30' }}
                                            />
                                        </div>
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
                                            onClick={(e) =>
                                                deleteBookings(e, booking)
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
