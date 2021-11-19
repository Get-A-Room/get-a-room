import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

type ProfileMenuProps = {
    anchorElement?: HTMLElement;
    isOpen: boolean;
    handleClose: () => any;
    goToPreferences: () => any;
    logout: () => any;
};

const ProfileMenu = (props: ProfileMenuProps) => {
    const { anchorElement, isOpen, handleClose, goToPreferences, logout } =
        props;

    const handlePreferences = () => {
        goToPreferences();
        handleClose();
    };

    const handleLogout = () => {
        logout();
        handleClose();
    };

    return (
        <Menu
            anchorEl={anchorElement}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            id="profile-menu"
            keepMounted
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            open={isOpen}
            onClose={handleClose}
        >
            <MenuItem onClick={handlePreferences}>
                <ListItemIcon>
                    <SettingsIcon />
                </ListItemIcon>
                <ListItemText>Preferences</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                    <LogoutIcon />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
            </MenuItem>
        </Menu>
    );
};

export default ProfileMenu;
