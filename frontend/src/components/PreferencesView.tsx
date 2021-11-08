import { Container, Typography } from '@mui/material';
import { useState } from 'react';
import { Preferences } from '../types';
import PreferenceButtons from './PreferenceFormButtons';
import SelectOffice from './SelectOffice';

type PreferencesViewProps = {
    preferences?: Preferences;
    setPreferences: (preferences?: Preferences) => any;
};

const PreferencesView = (props: PreferencesViewProps) => {
    const { preferences, setPreferences } = props;
    const [selectedPreferences, setSelectedPreferences] = useState<
        Preferences | undefined
    >(preferences);

    const handlePreferencesSubmit = () => {
        setPreferences(selectedPreferences);
    };

    return (
        <Container
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Typography
                variant="h3"
                sx={{
                    alignSelf: 'center',
                    color: '#f04e30',
                    pt: 6,
                    pb: 10
                }}
            >
                Preferences
            </Typography>

            <SelectOffice
                currentPreferencesOffice={preferences?.building?.id}
                selectedPreferences={selectedPreferences}
                setSelectedPreferences={setSelectedPreferences}
            />
            <PreferenceButtons handleSubmit={handlePreferencesSubmit} />
        </Container>
    );
};

export default PreferencesView;
