import { Stack, Typography } from '@mui/material';
import GoogleLogin from './GoogleLogin';

const LoginView = () => {
    return (
        <Stack sx={{ paddingTop: 3 }} spacing={10}>
            <Typography
                sx={{ color: '#f04e30', fontWeight: 'bold' }}
                variant="h3"
            >
                Get a room!
            </Typography>
            <GoogleLogin />
        </Stack>
    );
};

export default LoginView;
