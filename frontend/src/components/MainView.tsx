import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';

import BookingView from './BookingView';
import PreferencesView from './PreferencesView';
import { Building, Preferences } from '../types';
import { getPreferences } from '../services/preferencesService';
import { getBuildings } from '../services/buildingService';
import PreferencesLoader from './PreferencesLoader';
import { Box } from '@mui/material';

const MainView = () => {
    const [preferences, setPreferences] = useState<Preferences | undefined>();

    const [buildings, setBuildings] = useState<Building[]>([]);

    useEffect(() => {
        getBuildings().then(setBuildings);
    }, []);

    useEffect(() => {
        getPreferences()
            .then(setPreferences)
            .catch(() => {
                // Redirected to login
            });
    }, []);

    return (
        <Box sx={{ flexGrow: 1, overflowY: 'scroll' }}>
            <Switch>
                <Route path="/preferences">
                    <PreferencesView
                        preferences={preferences}
                        setPreferences={setPreferences}
                        buildings={buildings}
                    />
                </Route>
                <Route path="/auth/success">
                    <PreferencesLoader
                        preferences={preferences}
                        setPreferences={setPreferences}
                        buildings={buildings}
                    />
                </Route>
                <Route path="/">
                    <BookingView preferences={preferences} />
                </Route>
            </Switch>
        </Box>
    );
};

export default MainView;
