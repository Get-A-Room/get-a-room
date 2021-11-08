import { useState, useEffect } from 'react';
import {
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    Box,
    SelectChangeEvent
} from '@mui/material';
import './SelectOffice.css';
import { getBuildings } from '../services/buildingService';
import { Building, Preferences } from '../types';

// Check if rooms are fetched
function areBuildingsFetched(buildings: Building[]) {
    return Array.isArray(buildings) && buildings.length > 0;
}

type SelectOfficeProps = {
    currentPreferencesOffice?: string;
    selectedPreferences?: Preferences;
    setSelectedPreferences: (preferences?: Preferences) => any;
};

const SelectOffice = (props: SelectOfficeProps) => {
    const {
        selectedPreferences,
        setSelectedPreferences,
        currentPreferencesOffice
    } = props;
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [selectedOffice, setSelectedOffice] = useState(
        currentPreferencesOffice || ''
    );

    useEffect(() => {
        getBuildings().then(setBuildings);
    }, []);

    const handleChange = (event: SelectChangeEvent) => {
        // Set select component state
        const buildingId = event.target.value;
        setSelectedOffice(buildingId);

        // if valid building set selected preferences
        const foundBuilding = buildings.find(
            (building) => building.id === buildingId
        );
        if (foundBuilding) {
            setSelectedPreferences({
                ...selectedPreferences,
                building: foundBuilding
            });
        }
    };

    return (
        <div className="OfficeSelect">
            <Box>
                <FormControl variant="outlined">
                    <InputLabel id="office-label">Office location</InputLabel>
                    <Select
                        onChange={handleChange}
                        defaultValue=""
                        value={selectedOffice}
                        className="OfficeSelect-box"
                        labelId="office-label"
                        id="office-select"
                        label="Office location"
                    >
                        {areBuildingsFetched(buildings) &&
                            buildings.map((building) => (
                                <MenuItem key={building.id} value={building.id}>
                                    {building.name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </Box>
        </div>
    );
};

export default SelectOffice;
