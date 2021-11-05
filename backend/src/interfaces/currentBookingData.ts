import { Schema } from 'express-validator';
import roomData from './roomData';
import * as schema from '../utils/googleSchema';

export default interface currentBookingData {
    id: string | null | undefined;
    startTime: string | null | undefined;
    endTime: string | null | undefined;
    room: schema.CalendarResource | null | undefined;
}
