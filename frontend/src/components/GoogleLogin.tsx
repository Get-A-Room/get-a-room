import React from 'react';
import './GoogleLogin.css';
import image from './google_image.png';

const GOOGLE_AUTH_ROUTE = 'auth/google';

const getGoogleAuthUrl = () => {
    if (process.env.NODE_ENV === 'development') {
        return `http://localhost:8080/${GOOGLE_AUTH_ROUTE}`;
    } else {
        return `${window.location.origin}/${GOOGLE_AUTH_ROUTE}`;
    }
};

const login = () => {
    // Redirect to google login page
    window.location.assign(getGoogleAuthUrl());
};

const GoogleLogin = () => {
    return (
        <button className="GoogleButton" onClick={login}>
            <img className="GoogleLogin-logo" src={image} alt=""></img>
        </button>
    );
};

export default GoogleLogin;
