import { useState, useEffect, Key, ReactChild, ReactFragment, ReactPortal } from 'react';
import {
    Button,
    Box,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import './BookingView.css'


function BookingView() {
    const token = 'ya29.a0ARrdaM-bnoXH7SMpZIUk1DKMmGvk2wOjpKi9am6LjcJUeqxjA7bGILaUybviAyE-RSdDTTIMWdQjd5wsWGaDGk0YFy06qVjn3Shn63T1hKNagUUOqCgQ9WHdRrbZp70QkdtM9M4ENDWhXQSoJKRVWMzuBlD8Sg';

    const backendUrl = 'http://localhost:8080';

    const [rooms, setRooms] = useState<any[]>([]);

    useEffect(() => {
        getRooms();

        async function getRooms() {
            const res = await fetch(backendUrl + '/rooms', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                }
            });
            const room = await res.json();

            setRooms(room);
        }
    }, []);

    // Rooms as an array
    let arrayOfRooms: any = rooms['rooms' as any];

    return (
        <div className="BookingView">
            <header className="BookingView-header">
                <h1>Available rooms</h1>
            </header>
            <List>
                    {arrayOfRooms && arrayOfRooms.map((room: { id: Key | null | undefined; name: boolean |
                                                                ReactChild | ReactFragment | ReactPortal |
                                                                null | undefined; }) =>
                        <Box key={room.id} m={1} border={2} borderColor='#282c34'>
                            <ListItem>
                                <ListItemText
                                    disableTypography
                                    style={{
                                        fontSize: '18x',
                                        fontWeight: 'bold',
                                    }}>
                                    {room.name}
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
                                    }}>
                                    Quick Book
                                </Button>
                            </ListItem>
                        </Box>
                    )}
            </List>
        </div>
    );
}

export default BookingView;
