import Preferences from '../types/preferences';

type User = {
    subject: string;
    preferences: Preferences;
    name?: string;
    refreshToken?: string;
};

export default User;
