import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

import { logout } from '../services/authService';
import ProfileMenu from './ProfileMenu';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuAnchorElement, setMenuTargetElement] = useState<
        HTMLElement | undefined
    >();
    const history = useHistory();

    const goToPreferences = () => {
        history.push('/preferences');
    };

    const doLogout = () => {
        logout()
            .then(() => {
                history.push('/login');
            })
            .catch(() => {
                history.push('/login');
            });
    };

    const handleHomeClick = () => {
        history.push('/');
    };

    const handleProfileMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
        setMenuTargetElement(e.currentTarget);
        setIsMenuOpen(true);
    };

    return (
        <AppBar id="app-bar" position="static" color="primary">
            <Toolbar>
                <Box flexGrow={1}>
                    <IconButton size="large" onClick={handleHomeClick}>
                        <HomeOutlinedIcon fontSize="inherit" />
                    </IconButton>
                </Box>
                <IconButton size="large" onClick={handleProfileMenuOpen}>
                    <PersonOutlineIcon fontSize="inherit" />
                </IconButton>
            </Toolbar>
            <ProfileMenu
                anchorElement={menuAnchorElement}
                isOpen={isMenuOpen}
                handleClose={() => setIsMenuOpen(false)}
                logout={doLogout}
                goToPreferences={goToPreferences}
            />
            {/*Extra toolbar: https://mui.com/components/app-bar/#fixed-placement*/}
        </AppBar>
    );
};

export default NavBar;
