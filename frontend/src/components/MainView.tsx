import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Container } from '@mui/material';

import './MainView.css';
import Login from './GoogleLogin';
import BookingView from './BookingView';
import PreferencesView from './PreferencesView';
import { Preferences } from '../types';

const MainView = () => {
    const getPreferences = (): Promise<Preferences> => {
        return Promise.resolve({
            building: {
                id: 'Hermia 5',
                name: 'Hermia 5'
            }
        });
    };

    const [preferences, setPreferences] = useState<Preferences | undefined>();

    useEffect(() => {
        getPreferences()
            .then((result) => {
                setPreferences(result);
            })
            .catch((error) => {
                setPreferences(undefined);
            });
    }, []);

    return (
        <div>
            <Switch>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/preferences">
                    <PreferencesView
                        preferences={preferences}
                        setPreferences={setPreferences}
                    />
                </Route>
                <Route path="/">
                    <BookingView />
                </Route>
            </Switch>
        </div>
    );
};

export default MainView;
