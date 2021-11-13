import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';

import './MainView.css';
import BookingView from './BookingView';
import PreferencesView from './PreferencesView';
import { Building, Preferences } from '../types';
import { getPreferences } from '../services/preferencesService';
import NavBar from './NavBar';
import { getBuildings } from '../services/buildingService';
import PreferencesLoader from './PreferencesLoader';

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
        <div>
            <Switch>
                <Route path="/preferences">
                    <PreferencesView
                        preferences={preferences}
                        setPreferences={setPreferences}
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
                    <BookingView />
                </Route>
            </Switch>
            <NavBar />
        </div>
    );
};

export default MainView;
