import { Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Building, Preferences } from '../types';
import { updatePreferences } from '../services/preferencesService';
import BuildingSelect from './BuildingSelect';
import CenteredProgress from './util/CenteredProgress';
import FormButtons from './util/FormButtons';
import useCreateNotification from '../hooks/useCreateNotification';

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
    const { createErrorNotification } = useCreateNotification();

    const goToMainView = useCallback(() => {
        // Use replace in place of push because it's a temporary page and wouln't work if navigated back to
        history.replace('/');
    }, [history]);

    useEffect(() => {
        if (preferences?.building?.id) {
            // Preferences already set
            goToMainView();
        }
    }, [preferences, goToMainView]);

    const savePreferences = () => {
        const foundBuilding = buildings.find(
            (building) => building.id === selectedBuildingId
        );
        if (!foundBuilding) {
            createErrorNotification('Invalid office');
            return;
        }
        updatePreferences({ building: foundBuilding })
            .then((savedPreferences) => {
                setPreferences(savedPreferences);
                goToMainView();
            })
            .catch(() => {
                createErrorNotification('Could not update preferences');
            });
    };

    if (!preferences) {
        // Loading preferences
        return <CenteredProgress />;
    }
    return (
        <Stack
            id="preferences-loader"
            height="100%"
            justifyContent="space-around"
        >
            <Typography textAlign="center" variant="h4">
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
