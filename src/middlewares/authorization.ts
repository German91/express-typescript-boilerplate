import { Request, Response, NextFunction } from 'express';
import * as _ from 'lodash';

import Token from './../utils/tokens';
import User from './../models/User';
import { IPayload } from '../interfaces/IPayload';
import { IUser } from '../interfaces/IUser';

class Authorization {
    public static async isLogged(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers['authorization'];
            const decoded: IPayload = Token.decodeToken(token.toString());
            const user: IUser = await User.findById(decoded._id);

            req['user'] = user;
            req['token'] = token;

            next();
        } catch (err) {
            res.status(401).send({ code: 401, status: 'error', message: 'Unauthorized' });
        }
    }

    // public static async isAdmin(req: Request, res: Response, next: NextFunction) {
    //     const roles: string[] = req['user'].roles;

    //     const hasRole: boolean = _.includes(roles, 'admin');

    //     if (!hasRole)
    //         return res.status(401).send({ code: 401, status: 'error', message: 'Unauthorized' });

    //     next();
    // }
}

export default Authorization;
