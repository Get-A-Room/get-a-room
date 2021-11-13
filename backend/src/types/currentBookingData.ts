import roomData from './roomData';

export type currentBookingData = {
    id: string | null | undefined;
    startTime: string | null | undefined;
    endTime: string | null | undefined;
    room: roomData | null | undefined;
};

export default currentBookingData;
