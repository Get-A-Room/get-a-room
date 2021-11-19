import {
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    Box,
    SelectChangeEvent
} from '@mui/material';
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
        <Box textAlign="center">
            <FormControl variant="outlined">
                <InputLabel id="building-label">Office location</InputLabel>
                <Select
                    value={selectedBuildingId}
                    defaultValue=""
                    onChange={handleChange}
                    labelId="building-label"
                    id="building-select"
                    label="Office location"
                    sx={{ minWidth: '200px' }}
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
    );
};

export default BuildingSelect;
