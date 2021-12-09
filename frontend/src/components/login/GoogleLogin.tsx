import React from 'react';
import { ReactComponent as GoogleLogo } from './img/google-signin-buttons/normal.svg';

// import pressed from './img/google-signin-buttons/pressed.svg';
// import focus from './img/google-signin-buttons/focus.svg';
// import disabled from './img/google-signin-buttons/disabled.svg';

// import { login } from '../../services/authService';
import { ButtonBase, Paper } from '@mui/material';

const GoogleLogin = () => {
    return (
        <ButtonBase disableRipple={true}>
            <Paper elevation={5} sx={{ p: '1px', pb: 0 }}>
                <GoogleLogo height="4rem" width="16rem" />
            </Paper>
        </ButtonBase>
    );
};

export default GoogleLogin;
