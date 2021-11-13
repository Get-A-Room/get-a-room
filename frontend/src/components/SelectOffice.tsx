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
import { Building } from '../types';
import { isNonEmptyArray } from '../util/objectUtils';

type SelectOfficeProps = {
    selectedOffice: string;
    setSelectedOffice: (officeId: string) => any;
    buildings: Building[];
};

const SelectOffice = (props: SelectOfficeProps) => {
    const { selectedOffice, setSelectedOffice, buildings } = props;

    const handleChange = (event: SelectChangeEvent) => {
        // Set select component state
        const buildingId = event.target.value;
        setSelectedOffice(buildingId);
    };

    if (!buildings) return null;
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
                        {isNonEmptyArray(buildings) &&
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
