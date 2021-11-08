import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const PreferencesButton = () => {
    return (
        <Link to="/preferences" style={{ textDecoration: 'none' }}>
            <Button sx={{ color: 'white' }}>Preferences</Button>
        </Link>
    );
};

export default PreferencesButton;
