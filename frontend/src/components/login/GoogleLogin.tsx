import React from 'react';
import { ReactComponent as GoogleLogo } from './img/google-signin-buttons/normal.svg';

// import pressed from './img/google-signin-buttons/pressed.svg';
// import focus from './img/google-signin-buttons/focus.svg';
// import disabled from './img/google-signin-buttons/disabled.svg';

// import { login } from '../../services/authService';
import { ButtonBase, Paper } from '@mui/material';

const GoogleLogin = () => {
    return (
        <ButtonBase disableRipple={true} sx={{ py: 0, width: '60%' }}>
            <Paper elevation={8}>
                <GoogleLogo />
            </Paper>
        </ButtonBase>
    );
};

export default GoogleLogin;
