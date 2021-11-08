import { Schema } from 'mongoose';
import BuildingData from '../types/buildingData';
import Preferences from '../types/preferences';

export const buildingSchema = new Schema<BuildingData>(
    {
        id: { required: true, type: String },
        name: { required: true, type: String }
    },
    { _id: false }
);

export const preferencesSchema = new Schema<Preferences>(
    {
        building: {
            required: false,
            type: buildingSchema
        }
    },
    { _id: false }
);
