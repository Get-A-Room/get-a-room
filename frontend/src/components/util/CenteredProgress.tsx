import { Box, CircularProgress } from '@mui/material';

const CenteredProgress = () => (
    <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
    >
        <CircularProgress sx={{ color: '#f04e30' }} />
    </Box>
);

export default CenteredProgress;
