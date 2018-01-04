import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator/check';
import { matchedData, sanitize } from 'express-validator/filter';

import User from './../models/User';
import Token from './../utils/tokens';

import { IUser } from '../interfaces/IUser';

class UserRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    /**
     * @api {post} /v1/auth/signup              Create a new user
     * @apiName Signup
     * @apiVersion 1.0.0
     * @apiGroup Authentication
     *
     * @apiParam {String} email                 User's email
     * @apiParam {String} password              User's password
     * @apiParam {String} username              User's username
     *
     * @apiSuccess (Success 2xx) 201/Created
     * @apiSuccessExample Success-Response:
     *   HTTP 201 CREATED
     *   {
     *     code: 201,
     *     status: 'success',
     *     message: 'Account successfully created',
     *     user: Object(_id, email, password, username, roles, created_at, updated_at),
     *     token: Auth token
     *   }
     * @apiError 400/Bad-Request               Invalid params
     */
    public async SignUp (req: Request, res: Response) {
       const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).send({ errors: errors.mapped() });

        try {
            const user = new User(req.body);
            await user.save();
            
            // Generate auth token
            const token: string = Token.encodeToken({ _id: user._id });

            res.status(200).send({ code: 200, status: 'success', message: 'Account successfully created', token, user });
        } catch (err) {
            res.status(400).send({ code: 400, status: 'error', message: err });
        }
    }

    /**
     * @api {post} /v1/auth/login               Login
     * @apiName Login
     * @apiVersion 1.0.0
     * @apiGroup Authentication
     *
     * @apiParam {String} email                 User's email (optional)
     * @apiParam {String} username              User's username (optional)
     * @apiParam {String} password              User's password
     *
     * @apiSuccess (Success 2xx) 200/OK
     * @apiSuccessExample Success-Response:
     *   HTTP 200 OK
     *   {
     *     code: 200,
     *     status: 'success',
     *     user: Object(_id, email, password, username, roles, created_at, updated_at),
     *     token: Auth token
     *   }
     * @apiError 400/Bad-Request               Invalid params
     */
    public async Login (req: Request, res: Response) {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).send({ errors: errors.mapped() });

        try {
            const { username, email, password } = req.body;

            const user: IUser = await User.findByCredentials(password, email, username);
            const token: string = Token.encodeToken({ _id: user._id });

            res.status(200).send({ code: 200, status: 'success', token, user });
        } catch (err) {
            res.status(400).send({ code: 400, status: 'error', message: err });
        }
    }

    public routes(): void {
        this.router.post('/signup', [
            check('username').exists().trim(),
            check('email').exists().isEmail().trim().normalizeEmail(),
            check('password').exists()
        ], this.SignUp);

        this.router.post('/login', [
            check('username').trim().optional(),
            check('email').isEmail().trim().normalizeEmail().optional(),
            check('password').exists()
        ], this.Login);
    }
}

const userRoutes = new UserRouter();
userRoutes.routes();

export default userRoutes.router;
