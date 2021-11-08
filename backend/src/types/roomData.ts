type RoomData = {
    id: string | null | undefined;
    name: string | null | undefined;
    email: string | null | undefined;
    capacity: number | null | undefined;
    building: string | null | undefined;
    floor: string | null | undefined;
    features: string[] | null | undefined;
    nextCalendarEvent: string | null | undefined;
    location: string | null | undefined;
};

export default RoomData;
