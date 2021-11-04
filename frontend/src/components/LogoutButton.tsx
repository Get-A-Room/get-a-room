import { logout } from '../services/authService';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const LogoutButton = () => {
    return (
        <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button onClick={logout} sx={{ color: 'white' }}>
                Logout
            </Button>
        </Link>
    );
};

export default LogoutButton;
