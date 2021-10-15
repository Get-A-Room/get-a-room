import { Schema } from 'mongoose';

export type Preferences = {
    favouriteBuilding?: {
        id: string;
        name: string;
    };
};

export type Building = {
    id: string;
    name: string;
};

export const buildingSchema = new Schema<Building>(
    {
        id: { required: true, type: String },
        name: { required: true, type: String }
    },
    { _id: false }
);

export const preferencesSchema = new Schema<Preferences>(
    {
        favouriteBuilding: {
            required: false,
            type: buildingSchema
        }
    },
    { _id: false }
);
