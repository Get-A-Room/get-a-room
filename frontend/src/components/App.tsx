import React from 'react';
import './App.css';
import { Route, Router, Switch } from 'react-router-dom';
import { history } from '../services/axiosConfigurer';
import MainView from './MainView';
import LoginView from './LoginView';

function App() {
    return (
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
    );
}

export default App;
