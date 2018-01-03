export interface IUser {
    _id?: string;
    email: string;
    username: string;
    password?: string;
    roles: Array<string>;
    created_at?: string;
    updated_at?: string;
}
