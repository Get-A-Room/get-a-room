import { Schema } from 'mongoose';
import buildingData from '../interfaces/buildingData';

export type Preferences = {
    building?: buildingData;
};

export type Building = {
    buildingId: string;
    buildingName: string;
    floorNames: string[];
    description: string;
};

export const buildingSchema = new Schema<buildingData>(
    {
        buildingId: { required: true, type: String },
        buildingName: { required: true, type: String },
        floorNames: { required: false, type: String },
        description: { required: false, type: String }
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
