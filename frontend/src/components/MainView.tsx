import React from 'react';
import { Switch, Route } from 'react-router-dom';

import './MainView.css';
import Login from './GoogleLogin';
import OfficeSelection from './SelectOffice';
import BookingView from './BookingView';

const MainView = () => {
    return (
        <div>
            <Switch>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/preferences">
                    <OfficeSelection />
                </Route>
                <Route path="/">
                    <BookingView />
                </Route>
            </Switch>
        </div>
    );
};

export default MainView;
