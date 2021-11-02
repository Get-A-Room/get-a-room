import React, { useState, useEffect } from 'react';
import {
    Button,
    List,
    Card,
    CardActions,
    CardContent,
    Typography,
    CircularProgress,
    IconButton,
    Collapse
} from '@mui/material';
import { Business, Group, ExpandMore, ExpandLess } from '@mui/icons-material';
import './BookingView.css';
import { getRooms } from '../services/roomService';
import { makeBooking } from '../services/bookingService';
import { Room, BookingDetails } from '../types';
import NavBar from './NavBar';

async function book(event: React.MouseEvent<HTMLElement>, room: Room) {
    alert('Booking successful!');

    let bookingDetails: BookingDetails = {
        duration: 60,
        title: 'Title',
        roomId: 'test@test.fi'
    };

    makeBooking(bookingDetails);
}

// Return room name
function getName(room: Room) {
    return room.name;
}

// Return the building of a room
function getBuilding(room: Room) {
    return room.building;
}

// Return room capacity
function getCapacity(room: Room) {
    return room.capacity;
}

// Return room features
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

// Check if rooms are fetched
function areRoomsFetched(rooms: Room[]) {
    return Array.isArray(rooms) && rooms.length > 0;
}

function BookingView() {
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        getRooms().then(setRooms);
    }, []);

    const [expanded, setExpanded] = React.useState('false');

    const handleExpandClick = (
        event: React.MouseEvent<HTMLElement>,
        room: Room
    ) => {
        setExpanded(expanded === room.id ? 'false' : room.id);
    };

    return (
        <div className="BookingView">
            <header className="BookingView-header">
                <h1>Available rooms</h1>
            </header>
            {!areRoomsFetched(rooms) ? (
                <div className="BookingView-loadingScreen">
                    <CircularProgress style={{ color: '#F04E30' }} />
                </div>
            ) : (
                <List>
                    {areRoomsFetched(rooms) &&
                        rooms.map((room) => (
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
                                    <Typography
                                        style={{
                                            fontSize: '18px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {getName(room)}
                                    </Typography>
                                    <Button
                                        style={{
                                            backgroundColor: '#282c34',
                                            color: 'white',
                                            fontSize: '18px',
                                            textTransform: 'none',
                                            animation: 'ripple 600ms linear',
                                            minWidth: '120px',
                                            minHeight: '50px',
                                            maxWidth: '120px',
                                            maxHeight: '50px'
                                        }}
                                        onClick={(e) => book(e, room)}
                                    >
                                        Quick Book
                                    </Button>
                                </CardContent>
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
                                {getFeatures(room).length > 0 ? (
                                    <div>
                                        <CardContent
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                maxHeight: '20px'
                                            }}
                                        >
                                            <CardActions disableSpacing>
                                                <IconButton
                                                    onClick={(e) =>
                                                        handleExpandClick(
                                                            e,
                                                            room
                                                        )
                                                    }
                                                    aria-label="Expand"
                                                >
                                                    {expanded === room.id ? (
                                                        <ExpandLess />
                                                    ) : (
                                                        <ExpandMore />
                                                    )}
                                                </IconButton>
                                            </CardActions>
                                        </CardContent>
                                        <Collapse
                                            in={expanded === room.id}
                                            timeout="auto"
                                            unmountOnExit
                                        >
                                            <CardContent>
                                                <Typography
                                                    style={{ fontSize: '16px' }}
                                                >
                                                    {getFeatures(room)}
                                                </Typography>
                                            </CardContent>
                                        </Collapse>
                                    </div>
                                ) : null}
                            </Card>
                        ))}
                </List>
            )}
            <NavBar />
        </div>
    );
}

export default BookingView;
