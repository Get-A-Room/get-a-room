import { Room } from '../types';
import { DateTime } from 'luxon';
import axios from './axiosConfigurer';

export const getRooms = async (
    buildingId?: string,
    showReserved?: boolean
): Promise<Room[]> => {
    const urlParams = new URLSearchParams();
    if (buildingId) {
        urlParams.append('building', buildingId);
    }
    if (showReserved) {
        urlParams.append('showReserved', showReserved.toString());
    }

    // Add local end of day as end time for room availability lookup
    // Should this be moved somewhere else?
    let endTime = DateTime.local().endOf('day').toUTC();

    // If under 60 minutes left of a day, set end to next days end of day
    // as backend doesn't return rooms with less than 30 minutes of availability
    if (endTime.diffNow(['minutes']).minutes <= 60) {
        endTime = endTime.plus({ days: 1 }).toUTC();
    }

    urlParams.append('until', endTime.toISO());

    const response = await axios.get('/rooms', { params: urlParams });
    return response.data.rooms;
};
