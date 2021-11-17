import roomData from './roomData';

export type CurrentBookingData = {
    id: string | null | undefined;
    startTime: string | null | undefined;
    endTime: string | null | undefined;
    room: roomData | null | undefined;
};

export default CurrentBookingData;
