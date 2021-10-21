import React from 'react';
import './SelectOffice.css';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

const CitySelection = () => {
    return (
        <Box className="OfficeSelect">
            <FormControl variant="standard">
                <InputLabel id="office-label">Office location</InputLabel>
                <Select
                    className="OfficeSelect"
                    labelId="office-label"
                    id="office-select"
                    label="Office location"
                >
                    <MenuItem value={1}>Helsinki</MenuItem>
                    <MenuItem value={2}>Oulu</MenuItem>
                    <MenuItem value={3}>Tampere</MenuItem>
                    <MenuItem value={4}>Turku</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default CitySelection;
