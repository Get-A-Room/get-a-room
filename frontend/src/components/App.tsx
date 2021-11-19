import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { history } from '../services/axiosConfigurer';
import { theme } from '../theme';
import MainView from './MainView';
import LoginView from './LoginView';
import { CssBaseline, ThemeProvider } from '@mui/material';

function App() {
    return (
        <div id="app">
            <ThemeProvider theme={theme}>
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
            </ThemeProvider>
        </div>
    );
}

export default App;
