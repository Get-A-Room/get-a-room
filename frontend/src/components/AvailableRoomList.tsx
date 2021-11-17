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
    Box
} from '@mui/material';
import { Business, Group, ExpandMore, ExpandLess } from '@mui/icons-material';
import './BookingView.css';
import { Booking, BookingDetails, Room } from '../types';
import { getBookings, makeBooking } from '../services/bookingService';
import TimeLeft from './util/TimeLeft';

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

    makeBooking(bookingDetails)
        .then(() => {
            getBookings().then(setBookings);
            window.scrollTo(0, 0);
            alert('Booking successful!');
        })
        .catch(() => {
            alert('Booking failed.');
        });
}

function getNextCalendarEvent(room: Room) {
    return room.nextCalendarEvent;
}

function getName(room: Room) {
    return room.name;
}

function getBuilding(room: Room) {
    return room.building;
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
    setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
};

const AvailableRoomList = (props: BookingListProps) => {
    const { rooms, setBookings } = props;

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
            <div className="BookingView">
                <List>
                    {rooms.map((room) => (
                        <Card
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
                                    display: 'flex'
                                }}
                            >
                                <Box>
                                    <Box>
                                        <Typography
                                            style={{
                                                fontSize: '18px',
                                                fontWeight: 'bold'
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
                                <CardActions disableSpacing>
                                    <Button
                                        id="quickBook-button"
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
                                            handleBookingCollapse(e, room)
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
                                </CardActions>
                            </CardContent>
                            {expandedBooking === room.id ? (
                                <CardContent
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        maxHeight: '20px'
                                    }}
                                >
                                    <Collapse
                                        in={expandedBooking === room.id}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <CardContent>
                                            <Button
                                                id="book30Min-button"
                                                style={{
                                                    backgroundColor: '#282c34',
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
                                                onClick={(e) =>
                                                    book(
                                                        e,
                                                        room,
                                                        30,
                                                        setBookings
                                                    )
                                                }
                                            >
                                                30 min
                                            </Button>
                                            <Button
                                                id="book60Min-button"
                                                style={{
                                                    backgroundColor: '#282c34',
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
                                                onClick={(e) =>
                                                    book(
                                                        e,
                                                        room,
                                                        60,
                                                        setBookings
                                                    )
                                                }
                                            >
                                                60 min
                                            </Button>
                                        </CardContent>
                                    </Collapse>
                                </CardContent>
                            ) : null}
                            <div>
                                <CardContent
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        maxHeight: '10px'
                                    }}
                                >
                                    <CardActions disableSpacing>
                                        <IconButton
                                            onClick={(e) =>
                                                handleFeaturesCollapse(e, room)
                                            }
                                            aria-label="Expand"
                                        >
                                            {expandedFeatures === room.id ? (
                                                <ExpandLess />
                                            ) : (
                                                <ExpandMore />
                                            )}
                                        </IconButton>
                                    </CardActions>
                                </CardContent>
                                <Collapse
                                    in={expandedFeatures === room.id}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <CardContent
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'left',
                                            maxHeight: '20px'
                                        }}
                                    >
                                        <Business />
                                        <Typography style={{ maxWidth: '2px' }}>
                                            {' '}
                                        </Typography>
                                        <Typography
                                            style={{
                                                fontSize: '16px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {getBuilding(room)}
                                        </Typography>
                                    </CardContent>
                                    <CardContent
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'left',
                                            maxHeight: '20px'
                                        }}
                                    >
                                        <Group />
                                        <Typography style={{ maxWidth: '2px' }}>
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
                                    </CardContent>
                                    <CardContent>
                                        <Typography
                                            style={{ fontSize: '16px' }}
                                        >
                                            {getFeatures(room)}
                                        </Typography>
                                    </CardContent>
                                </Collapse>
                            </div>
                        </Card>
                    ))}
                </List>
            </div>
        </div>
    );
};

export default AvailableRoomList;
