import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';

function BookingView() {
    const token = 'ya29.a0ARrdaM_IYvLuNV3qX6vTJHKfn-jH9ARt3uUpWJLHk-yYJp0VdHwG-pk6pjOc9OJ6GWYzJUR7xjefMof_LNzHwjkyQQ' +
        'ETjMKUfdxNZUxL_rITosJTSPkdjseUqafFcN40LukiFyAxD7ArAJbLwA95LxYC1g9Vzw';

    const backendUrl = 'http://localhost:8080';

    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        getRooms();

        async function getRooms() {
            const res = await fetch(backendUrl + '/rooms');
            const room = await res.json();

            setRooms(room);
        }
    }, []);

    /*
    fetch(backendUrl + '/rooms', {
        method: 'GET',
        headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(json => console.log(json));
    */

    // TODO: Display the rooms
    return (
        <div className="BookingView">
            <header className="BookingView-header">
                <h1>Available rooms</h1>
            </header>
            {rooms && (
                <div className="rooms">
                    {rooms.map((room, index) => (
                        <div key={index}>
                            <h2>{room}</h2>
                        </div>
                    ))}
                </div>
            )}
            <Button>Book</Button>
        </div>
    );
}

export default BookingView;
