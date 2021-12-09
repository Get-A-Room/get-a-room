import React from 'react';

import { ReactComponent as GoogleSvg } from './google-login-button.svg';

import { login } from '../../services/authService';
import { ButtonBase, Paper } from '@mui/material';

const GoogleLogin = () => {
    return (
        <ButtonBase
            onClick={login}
            disableRipple={true}
            sx={{
                '&:hover': {
                    filter: 'brightness(90%)'
                },
                '&:active': {
                    filter: 'brightness(80%)'
                }
            }}
        >
            <Paper elevation={5} sx={{ p: '1px', pb: 0 }}>
                <GoogleSvg width="16rem" height="4rem" />
            </Paper>
        </ButtonBase>
    );
};

export default GoogleLogin;
