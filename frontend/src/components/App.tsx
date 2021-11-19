import React from 'react';
import './App.css';
import { Route, Router, Switch } from 'react-router-dom';
import { history } from '../services/axiosConfigurer';
import { SnackbarProvider } from 'notistack';
import MainView from './MainView';
import LoginView from './LoginView';

function App() {
    console.log(document.getElementById('main-view'));
    return (
        <SnackbarProvider
            maxSnack={1}
            domRoot={document.getElementById('main-view') || undefined}
            anchorOrigin={{
                horizontal: 'center',
                vertical: 'bottom'
            }}
        >
            <Router history={history}>
                <div className="App">
                    <Switch>
                        <Route path="/login">
                            <LoginView />
                        </Route>
                        <Route path="/">
                            <MainView />
                        </Route>
                    </Switch>
                </div>
            </Router>
        </SnackbarProvider>
    );
}

export default App;
