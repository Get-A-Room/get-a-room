import {
    useState,
    useEffect,
    Key,
    ReactChild,
    ReactFragment,
    ReactPortal
} from 'react';
import {
    Button,
    Box,
    List,
    ListItem,
    ListItemText,
    CircularProgress
} from '@mui/material';
import './BookingView.css';

const token =
    'ya29.a0ARrdaM8H12GuNmQ19kcGJQtC40N_xCEamBDQmfTsVLy5yf8gBYEX7OjOsJan9U-o9pQPXz__JrWF660dB-2pc43ojN1xohIQWPuyyms-0tShxJZXH9yjawT-oMdykSKHdIoRdU39VWnjFoT8TwaUABL_00_yow';
const backendUrl = 'http://localhost:8080';

async function book() {
    alert('Booking successful!');

    /*
    const res = await fetch(backendUrl + '/booking', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'content-type': 'application/json;',
        }
    });
    */
}

function roomsFound(rooms: Array<any>) {
    try {
        let roomsLength = rooms.length;
        if (roomsLength >= 0) {
            return true;
        }
    } catch (e) {
        return false;
    }
    return false;
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
                    'Content-Type': 'application/json'
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
            {!roomsFound(arrayOfRooms) ? (
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
                            (room: {
                                id: Key | null | undefined;
                                name:
                                    | boolean
                                    | ReactChild
                                    | ReactFragment
                                    | ReactPortal
                                    | null
                                    | undefined;
                            }) => (
                                <Box
                                    key={room.id}
                                    m={1}
                                    border={2}
                                    borderColor="#282c34"
                                >
                                    <ListItem>
                                        <ListItemText
                                            disableTypography
                                            style={{
                                                fontSize: '18x',
                                                fontWeight: 'bold'
                                            }}
                                        >
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
                                            }}
                                            onClick={book}
                                        >
                                            Quick Book
                                        </Button>
                                    </ListItem>
                                </Box>
                            )
                        )}
                </List>
            )}
        </div>
    );
}

export default BookingView;
