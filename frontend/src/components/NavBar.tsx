import React from 'react';

import { useLocation } from 'react-router-dom';
import LogoutButton from './LogoutButton';

import './NavBar.css';
import PreferencesButton from './PreferencesButton';

const NavBar = () => {
    const location = useLocation();

    return (
        <div className="NavBar">
            {location.pathname !== '/login' ? <PreferencesButton /> : null}
            {'Navigation bar'}
            {location.pathname !== '/login' ? <LogoutButton /> : null}
        </div>
    );
};

export default NavBar;
