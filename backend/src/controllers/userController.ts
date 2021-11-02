import { TokenPayload } from 'google-auth-library';
import UserModel, { User } from '../models/user';

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
