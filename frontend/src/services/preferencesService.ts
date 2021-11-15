import { Preferences } from '../types';
import axios from './axiosConfigurer';

export const getPreferences = async () => {
    const result = await axios.get('preferences');
    return result.data;
};

export const updatePreferences = async (preferences: Preferences) => {
    const result = await axios.put('preferences', preferences);
    return result.data;
};
