import React from 'react';
import './App.css';
import { Router } from 'react-router-dom';
import { history } from '../services/axiosConfigurer';
import NavBar from './NavBar';
import MainView from './MainView';

function App() {
    return (
        <Router history={history}>
            <div className="App">
                <MainView />
                <NavBar />
            </div>
        </Router>
    );
}

export default App;
