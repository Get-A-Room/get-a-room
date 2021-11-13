import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { updatePreferences } from '../services/preferencesService';
import { Building, Preferences } from '../types';
import BuildingSelect from './BuildingSelect';
import CenteredProgress from './util/CenteredProgress';
import FormButtons from './util/FormButtons';

type PreferencesViewProps = {
    buildings: Building[];
    preferences?: Preferences;
    setPreferences: (preferences?: Preferences) => any;
};

const PreferencesView = (props: PreferencesViewProps) => {
    const { buildings, preferences, setPreferences } = props;

    const [selectedBuildingId, setSelecedBuildingId] = useState('');

    // If current building found, show it in building select
    useEffect(() => {
        const preferencesBuildingId = preferences?.building?.id;
        const isValidBuilding = buildings.some(
            (building) => building.id === preferencesBuildingId
        );
        if (preferencesBuildingId && isValidBuilding) {
            setSelecedBuildingId(preferencesBuildingId);
        }
    }, [preferences, buildings]);

    const history = useHistory();

    const goToMainView = () => {
        history.push('/');
    };

    const handlePreferencesSubmit = () => {
        const foundBuilding = buildings.find(
            (building) => building.id === selectedBuildingId
        );
        if (foundBuilding) {
            updatePreferences({ building: foundBuilding })
                .then((savedPreferences) => {
                    setPreferences(savedPreferences);
                    goToMainView();
                })
                .catch(() => {
                    alert('Preferences could not be updated');
                });
        }
    };

    if (!preferences) return <CenteredProgress />;
    return (
        <Stack pt={5} justifyContent="space-between" height="80vh">
            <Typography variant="h3" color="#f04e30">
                Preferences
            </Typography>
            <BuildingSelect
                buildings={buildings}
                selectedBuildingId={selectedBuildingId}
                setSelectedBuildingId={setSelecedBuildingId}
            />
            <FormButtons
                submitText="Save"
                handleSubmit={handlePreferencesSubmit}
                cancelText="Cancel"
                handleCancel={goToMainView}
            />
        </Stack>
    );
};

export default PreferencesView;
