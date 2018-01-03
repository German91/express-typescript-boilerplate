import { Router, Request, Response } from 'express';

import User from './../models/User';
import IUser from './../interfaces/IUser';
import Token from './../utils/tokens';

class UserRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public async SignUp (req: Request, res: Response) {
        const user: IUser = new User(req.body);

        try {
            await User.remove({}); // Testing purposes
            await user.save();
            const token: string = await Token.encodeToken({ _id: user._id });

            res.status(201).send({ code: 201, status: 'success', message: 'User successfully created', token, user });
        } catch (err) {
            console.error(err);
            res.status(400).send({ code: 400, status: 'error', message: err });
        }
    }

    public async Login (req: Request, res: Response) {
        const email: string = req.body.email;
        const password: string = req.body.password;

        try {
            const user: IUser = await User.findByCredentials(email, password);
            if (!user) Promise.reject('User not found');

            const token: string = await Token.encodeToken({ _id: user._id });
            res.status(200).send({ code: 200, status: 'success', token, user });
        } catch (err) {
            res.status(400).send({ code: 400, status: 'error', message: err });
        }
    }

    public routes(): void {
        this.router.post('/signup', this.SignUp);
        this.router.post('/login', this.Login);
    }
}

const userRoutes = new UserRouter();
userRoutes.routes();

export default userRoutes.router;
