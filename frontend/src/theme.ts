import { createTheme } from '@mui/material';

const ORANGE = '#f04e30';

export const theme = createTheme({
    palette: {
        background: { default: '#f6f5f5' },
        primary: { main: ORANGE }
    },
    typography: {
        h3: { color: ORANGE },
        h4: { color: ORANGE, fontWeight: 'bold' },
        h5: { color: ORANGE, fontWeight: 'bold' }
    }
});
