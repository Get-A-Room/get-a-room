import { Booking, BookingDetails } from '../types';
import axios from './axiosConfigurer';

export const makeBooking = async (bookingDetails: BookingDetails) => {
    const response = await axios.post('booking', bookingDetails);
    return response.data;
};

export const getBookings = async (): Promise<Booking[]> => {
    const response = await axios.get('booking/current');
    console.log(response.data);
    return response.data;
};
