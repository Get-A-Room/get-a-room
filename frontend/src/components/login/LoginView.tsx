import { Box, Divider, Stack, Typography } from '@mui/material';
import GoogleLogin from './GoogleLogin';
import { ReactComponent as DuckLogo } from './img/duck.svg';
// import { Google } from '@mui/icons-material';

const LoginView = () => {
    return (
        <Box height="100vh">
            <Stack id="login-view" height="100%" justifyContent="space-evenly">
                <Box textAlign="center">
                    <Typography textAlign="center" variant="h3">
                        Get a Room!
                    </Typography>
                    <Typography variant="subtitle1">
                        Conference rooms on the fly
                    </Typography>
                </Box>
                <Box textAlign="center">
                    <DuckLogo
                        width="12rem"
                        height="12rem"
                        title="Vincit logo"
                    />
                </Box>
                <Box textAlign="center">
                    <GoogleLogin />
                </Box>
            </Stack>
        </Box>
    );
};

// position="sticky" bottom="0" top="auto"
export default LoginView;
