import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { history } from '../services/axiosConfigurer';
import MainView from './MainView';
import LoginView from './LoginView';
import { Box, CssBaseline } from '@mui/material';
import NavBar from './NavBar';

function App() {
    return (
        <div>
            <CssBaseline />
            <Router history={history}>
                <Switch>
                    <Route path="/login">
                        <LoginView />
                    </Route>
                    <Route path="/">
                        <Box
                            display="flex"
                            flexDirection="column"
                            height="100vh"
                        >
                            <MainView />
                            <NavBar />
                        </Box>
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
