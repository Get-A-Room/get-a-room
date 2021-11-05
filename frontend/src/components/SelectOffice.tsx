import { useState, useEffect } from 'react';
import { Select, FormControl, InputLabel, MenuItem, Box } from '@mui/material';
import './SelectOffice.css';
import { getBuildings } from '../services/buildingService';
import { Building } from '../types';
import { Router } from '@mui/icons-material';
import BookingView from './BookingView';
import { render } from '@testing-library/react';

// Return room name
function getName(building: Building) {
    return building.name;
}

// Return room name
function getId(building: Building) {
    return building.id;
}
// Check if rooms are fetched
function areBuildingsFetched(buildings: Building[]) {
    console.log(buildings);
    return Array.isArray(buildings) && buildings.length > 0;
}

function CitySelection() {
    const [buildings, setBuildings] = useState<Building[]>([]);

    useEffect(() => {
        getBuildings().then(setBuildings);
    }, []);

    return (
        <div className="OfficeSelect">
            <header className="OfficeSelect-header">
                <h1>Preferences</h1>
            </header>
            <Box>
                <FormControl variant="outlined">
                    <InputLabel id="office-label">Office location</InputLabel>
                    <Select
                        className="OfficeSelect-box"
                        labelId="office-label"
                        id="office-select"
                        label="Office location"
                    >
                        {areBuildingsFetched(buildings) &&
                            buildings.map((building) => (
                                <MenuItem value={getId(building)}>
                                    {getName(building)}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </Box>
            <div>
                <button className="OfficeSelect-confirm">CONFIRM</button>
            </div>
            <div>
                <button className="OfficeSelect-skip">SKIP</button>
            </div>
        </div>
    );
}

export default CitySelection;
