import { useState, useEffect, Key } from 'react';
import {
    Button,
    Box,
    List,
    ListItem,
    ListItemText,
    CircularProgress
} from '@mui/material';
import { Business, Group } from '@mui/icons-material';
import './BookingView.css';
import { getRooms } from '../services/roomService';
import { Room } from '../types';
import CurrentBooking from './CurrentBooking';

async function book() {
    alert('Booking successful!');
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

    return (
        <div>
            <CurrentBooking />
            <div className="BookingView">
                <header className="BookingView-header">
                    <h1>Available rooms</h1>
                </header>
                {!areRoomsFetched(rooms) ? (
                    <div className="BookingView-loadingScreen">
                        <CircularProgress
                            style={{
                                color: '#F04E30'
                            }}
                        />
                    </div>
                ) : (
                    <List>
                        {areRoomsFetched(rooms) &&
                            rooms.map((room) => (
                                <Box
                                    key={room.id}
                                    m={1}
                                    border={3}
                                    borderColor="#f04e30"
                                >
                                    <ListItem>
                                        <ListItemText
                                            disableTypography
                                            style={{
                                                fontSize: '18px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {getName(room)}
                                        </ListItemText>
                                        <Button
                                            style={{
                                                backgroundColor: '#282c34',
                                                color: 'white',
                                                fontSize: '18px',
                                                textTransform: 'none',
                                                minWidth: '120px',
                                                minHeight: '50px',
                                                maxWidth: '120px',
                                                maxHeight: '50px'
                                            }}
                                            onClick={book}
                                        >
                                            Quick Book
                                        </Button>
                                    </ListItem>
                                    <ListItem>
                                        <Business />
                                        <ListItemText
                                            style={{
                                                maxWidth: '2px'
                                            }}
                                        >
                                            {' '}
                                        </ListItemText>
                                        <ListItemText
                                            disableTypography
                                            style={{
                                                fontSize: '16px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {getBuilding(room)}
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <Group />
                                        <ListItemText
                                            style={{
                                                maxWidth: '2px'
                                            }}
                                        >
                                            {' '}
                                        </ListItemText>
                                        <ListItemText
                                            disableTypography
                                            style={{
                                                fontSize: '16px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {getCapacity(room)}
                                        </ListItemText>
                                    </ListItem>
                                    {getFeatures(room).length > 0 ? (
                                        <ListItem>
                                            <ListItemText
                                                disableTypography
                                                style={{
                                                    fontSize: '16px'
                                                }}
                                            >
                                                {getFeatures(room)}
                                            </ListItemText>
                                        </ListItem>
                                    ) : null}
                                </Box>
                            ))}
                    </List>
                )}
            </div>
        </div>
    );
}

export default BookingView;
