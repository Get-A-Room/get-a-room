import UserModel, { User } from '../models/user';

export function createUser(subject: string, refreshToken: string) {
    const userBase: User = {
        subject,
        refreshToken,
        preferences: {}
    };
    const user = new UserModel(userBase);
    return user.save();
}

export function getUserWithSubject(subject: string): Promise<User | null> {
    return UserModel.findOne({ subject }).exec();
}
