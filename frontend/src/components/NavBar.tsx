import React from 'react';

import { useLocation } from 'react-router-dom';
import LogoutButton from './LogoutButton';

import './NavBar.css';

const NavBar = () => {
    const location = useLocation();

    return (
        <div className="NavBar">
            {'Navigation bar'}
            {location.pathname !== '/login' ? <LogoutButton /> : null}
        </div>
    );
};

export default NavBar;
