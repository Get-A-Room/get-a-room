import { TokenPayload } from 'google-auth-library';
import UserModel from '../models/user';
import Preferences from '../types/preferences';
import User from '../types/user';

export function createUserFromTokenPayload(
    payload: TokenPayload,
    refreshToken?: string
) {
    const userBase: User = {
        subject: payload.sub,
        name: payload.name,
        refreshToken: refreshToken,
        preferences: {}
    };
    const user = new UserModel(userBase);
    return user.save();
}

export function getUserWithSubject(subject: string): Promise<User | null> {
    return UserModel.findOne({ subject }).exec();
}

export function updateRefreshToken(
    subject: string,
    refreshToken: string
): Promise<User | null> {
    return UserModel.findOneAndUpdate({ subject }, { refreshToken }).exec();
}

export function updatePreferences(
    subject: string,
    preferences: Preferences
): Promise<User | null> {
    return UserModel.findOneAndUpdate({ subject }, { preferences }).exec();
}
