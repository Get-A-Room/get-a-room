import axios from './axiosConfigurer';

const GOOGLE_AUTH_ROUTE = 'api/auth/google';

const getGoogleAuthUrl = () => {
    if (process.env.NODE_ENV === 'development') {
        return `http://localhost:8080/${GOOGLE_AUTH_ROUTE}`;
    } else {
        return `${window.location.origin}/${GOOGLE_AUTH_ROUTE}`;
    }
};

export const login = () => {
    // Redirect to google login page
    window.location.assign(getGoogleAuthUrl());
};

export const logout = () => {
    return axios.get('/auth/logout');
};
