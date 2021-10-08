import React from 'react';
import logo from './../logo.svg';
import './App.css';
import Header from './Header'
import MainView from './MainView'
import BookingView from './BookingView'

function App() {
    return (
        <div className="App">
            <Header />
            <MainView />
        </div>
    );
}

export default App;
