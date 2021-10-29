import { useEffect } from 'react';
import './SelectOffice.css';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const token = '';

async function getBuilding() {
    const res = await fetch('/api/buildings', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });
    const building = await res.json();
    console.log(building);
}

const CitySelection = () => {
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
                        <MenuItem value={1}>Helsinki</MenuItem>
                        <MenuItem value={2}>Oulu</MenuItem>
                        <MenuItem value={3}>Tampere</MenuItem>
                        <MenuItem value={4}>Turku</MenuItem>
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
};

export default CitySelection;
