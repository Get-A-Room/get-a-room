import React from 'react';
import './GoogleLogin.css';
import image from './google_image.png';

import { login } from '../services/authService';

const GoogleLogin = () => {
    return (
        <button className="GoogleButton" onClick={login}>
            <img className="GoogleLogin-logo" src={image} alt=""></img>
        </button>
    );
};

export default GoogleLogin;
