import { Booking, BookingDetails, AddTimeDetails } from '../types';
import axios from './axiosConfigurer';

export const makeBooking = async (bookingDetails: BookingDetails) => {
    const response = await axios.post('booking', bookingDetails);
    return response.data;
};

export const getBookings = async (): Promise<Booking[]> => {
    const response = await axios.get('booking/current');
    return response.data;
};

export const updateBooking = async (
    addTimeDetails: AddTimeDetails,
    bookingId: string
) => {
    const response = await axios.patch(
        'booking/' + bookingId + '/addTime',
        addTimeDetails
    );
    return response.data;
};

export const deleteBooking = async (bookingId: string) => {
    const response = await axios.delete('booking/' + bookingId);
    return response.data;
};
