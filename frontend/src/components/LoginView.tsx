import { Stack, Typography } from '@mui/material';
import GoogleLogin from './GoogleLogin';

const LoginView = () => {
    return (
        <Stack id="login-view" pt={3} spacing={10}>
            <Typography textAlign="center" variant="h3">
                Get a room!
            </Typography>
            <GoogleLogin />
        </Stack>
    );
};

export default LoginView;
