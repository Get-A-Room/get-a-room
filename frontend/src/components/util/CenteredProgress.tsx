import { Box, CircularProgress } from '@mui/material';

const CenteredProgress = () => (
    <Box display="flex" justifyContent="center" alignItems="center" pt={7}>
        <CircularProgress color="primary" />
    </Box>
);

export default CenteredProgress;
