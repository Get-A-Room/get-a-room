import { Building } from '../types';
import axios from './axiosConfigurer';

export const getBuildings = async (): Promise<Building[]> => {
    const response = await axios.get('/buildings');
    return response.data.buildings;
};
