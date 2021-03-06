export interface AddTimeDetails {
    timeToAdd: number;
}

export interface Booking {
    id: string;
    startTime: string;
    endTime: string;
    room: Room;
}

export interface BookingDetails {
    duration: number;
    title: string;
    roomId: string;
}

export interface Building {
    id: string;
    name: string;
}

export interface Preferences {
    building?: Building;
}

export interface Room {
    id: string;
    name: string;
    building: string;
    capacity?: number;
    features?: Array<string>;
    nextCalendarEvent: string;
}
