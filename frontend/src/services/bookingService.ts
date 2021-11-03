import { BookingDetails } from '../types';
import axios from './axiosConfigurer';

export const makeBooking = async (bookingDetails: BookingDetails) => {
    const response = await axios.post('booking', bookingDetails);
    return response.data;
};
