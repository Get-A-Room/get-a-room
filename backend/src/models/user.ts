import mongoose, { Schema } from 'mongoose';
import { preferencesSchema } from './preferences';
import User from '../types/user';

export const userSchema = new Schema<User>({
    subject: {
        type: String,
        required: [true, 'googleId is required'],
        unique: true,
        index: true
    },
    name: String,
    refreshToken: String,
    preferences: { required: true, type: preferencesSchema }
});

export default mongoose.model<User>('User', userSchema);
