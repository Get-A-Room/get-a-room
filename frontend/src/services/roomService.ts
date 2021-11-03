import { Room } from '../types';
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

    const response = await axios.get('/rooms', { params: urlParams });
    return response.data.rooms;
};
