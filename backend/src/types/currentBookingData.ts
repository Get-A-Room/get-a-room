import RoomData from './roomData';

export type CurrentBookingData = {
    id: string | null | undefined;
    startTime: string | null | undefined;
    endTime: string | null | undefined;
    room: RoomData;
};

export default CurrentBookingData;
