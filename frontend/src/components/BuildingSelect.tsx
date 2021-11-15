import {
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    Box,
    SelectChangeEvent
} from '@mui/material';
import './BuildingSelect.css';
import { Building } from '../types';
import { isNonEmptyArray } from '../util/objectUtils';

type BuildingSelectProps = {
    selectedBuildingId: string;
    setSelectedBuildingId: (buildingId: string) => any;
    buildings: Building[];
};

const BuildingSelect = (props: BuildingSelectProps) => {
    const { selectedBuildingId, setSelectedBuildingId, buildings } = props;

    const handleChange = (event: SelectChangeEvent) => {
        // Set select component state
        const buildingId = event.target.value;
        setSelectedBuildingId(buildingId);
    };

    return (
        <div className="BuildingSelect">
            <Box>
                <FormControl variant="outlined">
                    <InputLabel id="building-label">Office location</InputLabel>
                    <Select
                        onChange={handleChange}
                        defaultValue=""
                        value={selectedBuildingId}
                        className="BuildingSelect-box"
                        labelId="building-label"
                        id="building-select"
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

export default BuildingSelect;
