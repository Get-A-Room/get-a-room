import { get } from 'http';
import React from 'react';
import './GoogleLogin.css';
import image from './google_image.png';

function login() {
    //const response = fetch('localhost:8080/auth/google');
}

const GoogleLogin = () => {
    return (
        <button className="GoogleButton" onClick={login}>
            <img className="GoogleLogin-logo" src={image} alt=""></img>
        </button>
    );
};

export default GoogleLogin;
