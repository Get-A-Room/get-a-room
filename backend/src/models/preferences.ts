import { Schema } from 'mongoose';

export const preferencesSchema = new Schema({
    favouriteBuilding: {
        name: String,
        id: String
    }
});
