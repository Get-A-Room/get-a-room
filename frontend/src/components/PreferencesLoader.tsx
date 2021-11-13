import { Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useHistory } from 'react-router';

import { Building, Preferences } from '../types';
import { updatePreferences } from '../services/preferencesService';
import BuildingSelect from './BuildingSelect';
import CenteredProgress from './util/CenteredProgress';
import FormButtons from './util/FormButtons';

type PreferencesLoaderProps = {
    preferences?: Preferences;
    setPreferences: (preferences?: Preferences) => any;
    buildings: Building[];
};

/**
 * After preferences loaded, either asks the user for building preference.
 * If the building is already set (in earlier session), forwards straight to the booking view
 */
const PreferencesLoader = (props: PreferencesLoaderProps) => {
    const { preferences, setPreferences, buildings } = props;
    const [selectedBuildingId, setSelectedBuildingId] = useState('');

    const history = useHistory();

    const goToMainView = () => {
        // Use replace in place of push because it's a temporary page and wouln't work if navigated back to
        history.replace('/');
    };

    const savePreferences = () => {
        const foundBuilding = buildings.find(
            (building) => building.id === selectedBuildingId
        );
        if (!foundBuilding) {
            alert('Error occurred while setting building');
            return;
        }
        updatePreferences({ building: foundBuilding }).then(
            (savedPreferences) => {
                setPreferences(savedPreferences);
                goToMainView();
            }
        );
    };

    if (!preferences) {
        // Loading preferences
        return <CenteredProgress />;
    }
    if (preferences.building?.id) {
        // Preferences already set
        goToMainView();
        return null;
    }
    /* Height propery should maybe be changed to 100% when css is sorted out,
     so that it can depend on parent component instead of setting its own height */
    return (
        <Stack pt={5} justifyContent="space-between" height="80vh">
            <Typography variant="h4" color="#f04e30" fontWeight="bold">
                Select your office
            </Typography>
            <BuildingSelect
                buildings={buildings}
                selectedBuildingId={selectedBuildingId}
                setSelectedBuildingId={setSelectedBuildingId}
            />
            <FormButtons
                submitText="Confirm"
                handleSubmit={savePreferences}
                cancelText="Skip"
                handleCancel={goToMainView}
            />
        </Stack>
    );
};

export default PreferencesLoader;
