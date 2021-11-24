import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useCreateNotification from '../hooks/useCreateNotification';
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
    const { createSuccessNotification, createErrorNotification } =
        useCreateNotification();

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
                    createSuccessNotification(
                        'Preferences updated successfully'
                    );
                    goToMainView();
                })
                .catch(() => {
                    createErrorNotification('Could not update preferences');
                });
        }
    };

    if (!preferences) return <CenteredProgress />;
    return (
        <Stack
            id="preferences-view"
            height="100%"
            justifyContent="space-around"
        >
            <Typography textAlign="center" variant="h3">
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
