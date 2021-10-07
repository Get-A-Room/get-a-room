import mongoose, { Schema } from 'mongoose';
import { preferencesSchema } from './preferences';

export const userSchema = new Schema({
    googleId: {
        type: String,
        required: [true, 'googleId is required']
    },
    refreshToken: String,
    preferences: preferencesSchema
});

export default mongoose.model('User', userSchema);
