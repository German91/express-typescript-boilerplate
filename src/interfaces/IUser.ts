import { Document, Model } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    username: string;
    roles: string[];

    toJSON(): IUser;
}

export interface IUserModel extends Model<IUser> {
    // Static methods
    findByCredentials(password: string, email?: string, username?: string): IUser;
}
