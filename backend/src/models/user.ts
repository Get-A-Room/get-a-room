import mongoose, { Schema } from 'mongoose';
import { Preferences, preferencesSchema } from './preferences';

export type User = {
    subject: string;
    preferences: Preferences;
    name?: string;
    refreshToken?: string;
};

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
