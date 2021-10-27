import { useState, useEffect, Key } from 'react';
import {
    Button,
    List,
    Card,
    CardContent,
    Typography,
    CircularProgress
} from '@mui/material';
import { Business, Group } from '@mui/icons-material';
import './BookingView.css';

const token = '';
const backendUrl = 'http://localhost:8080';

async function book() {
    alert('Booking successful!');

    const res = await fetch(backendUrl + '/booking', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + token,
            ContentType: 'application/json'
        }
    });
    const book = await res.json();
    console.log(book);
}

// Return room name
function getName(room: any) {
    let name: any = room.name;
    return name;
}

// Return the building of a room
function getBuilding(room: any) {
    let building: any = room.building;
    return building;
}

// Return room capacity
function getCapacity(room: any) {
    let capacity: any = room.capacity;
    return capacity;
}

// Return room features
function getFeatures(room: any) {
    let features: any = room.features;
    let featuresDisplay = [];

    // Format room features
    for (let i = 0; i < features.length; i++) {
        featuresDisplay.push(features[i]);
        if (i !== features.length - 1) {
            featuresDisplay.push(', ');
        }
    }

    return featuresDisplay;
}

// Check if rooms are fetched
function roomsFetched(rooms: Array<any>) {
    try {
        // Rooms fetched successfully
        let roomsLength = rooms.length;
        if (roomsLength >= 0) {
            return true;
        }
    } catch (e) {
        // Fetching rooms...
        return false;
    }
}

function BookingView() {
    const [rooms, setRooms] = useState<any[]>([]);

    useEffect(() => {
        getRooms();

        async function getRooms() {
            const res = await fetch(backendUrl + '/rooms', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    ContentType: 'application/json'
                }
            });
            const room = await res.json();

            setRooms(room);
        }
    }, []);

    // Rooms as an array
    let arrayOfRooms: any = rooms['rooms' as any];

    console.log(arrayOfRooms);

    return (
        <div className="BookingView">
            <header className="BookingView-header">
                <h1>Available rooms</h1>
            </header>
            {!roomsFetched(arrayOfRooms) ? (
                <div className="BookingView-loadingScreen">
                    <CircularProgress
                        style={{
                            color: '#F04E30'
                        }}
                    />
                </div>
            ) : (
                <List>
                    {arrayOfRooms &&
                        arrayOfRooms.map(
                            (room: { id: Key | null | undefined }) => (
                                <Card
                                    sx={{
                                        bgcolor: '#d6d6d6',
                                        borderColor: '#f04e30',
                                        borderRadius: 3,
                                        boxShadow: 1,
                                        m: 1
                                    }}
                                >
                                    <CardContent>
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
                                                minWidth: '120px',
                                                minHeight: '50px',
                                                maxWidth: '120px',
                                                maxHeight: '50px'
                                            }}
                                            onClick={book}
                                        >
                                            Quick Book
                                        </Button>
                                    </CardContent>
                                    <CardContent>
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
                                    <CardContent>
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
                                        <CardContent>
                                            <Typography
                                                style={{ fontSize: '16px' }}
                                            >
                                                {getFeatures(room)}
                                            </Typography>
                                        </CardContent>
                                    ) : null}
                                </Card>
                            )
                        )}
                </List>
            )}
        </div>
    );
}

export default BookingView;
