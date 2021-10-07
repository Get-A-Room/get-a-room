import React from "react";
import Button from "@mui/material/Button";

function BookingView() {
    return (
        <div className="BookingView">
            <header className="BookingView-header">
                <h1>Available rooms</h1>
            </header>
            <body>
                <p>
                    Room1 <Button>Book</Button>
                </p>
                <p>
                    Room2 <Button>Book</Button>
                </p>
                <p>
                    Room3 <Button>Book</Button>
                </p>
            </body>
        </div>
    );
}

export default BookingView;
