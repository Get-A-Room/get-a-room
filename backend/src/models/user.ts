import mongoose, { Schema } from 'mongoose';
import { Preferences, preferencesSchema } from './preferences';

export type User = {
    subject: string;
    refreshToken?: string;
    preferences: Preferences;
};

export const userSchema = new Schema<User>({
    subject: {
        type: String,
        required: [true, 'googleId is required'],
        unique: true,
        index: true
    },
    refreshToken: String,
    preferences: { required: true, type: preferencesSchema }
});

export default mongoose.model<User>('User', userSchema);
