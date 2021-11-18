import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { history } from '../services/axiosConfigurer';
import MainView from './MainView';
import LoginView from './LoginView';
import { CssBaseline } from '@mui/material';

function App() {
    return (
        <div id="app">
            <CssBaseline />
            <Router history={history}>
                <Switch>
                    <Route path="/login">
                        <LoginView />
                    </Route>
                    <Route path="/">
                        <MainView />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
