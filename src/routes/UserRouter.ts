import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator/check';
import { matchedData, sanitize } from 'express-validator/filter';

import User from './../models/User';
import Token from './../utils/tokens';
import { IUser } from './../interfaces/IUser';
import limiter from './../middlewares/limiter';
import Email from './../utils/emails';
import Authorization from './../middlewares/authorization';

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
    public async signUp (req: Request, res: Response) {
       const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).send({ errors: errors.mapped() });

        try {
            const user = new User(req.body);
            await user.save();
            
            // Generate auth token
            const token: string = Token.encodeToken({ _id: user._id, roles: user.roles });

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
    public async login (req: Request, res: Response) {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).send({ errors: errors.mapped() });

        try {
            const { username, email, password } = req.body;

            const user: IUser = await User.findByCredentials(password, email, username);
            const token: string = Token.encodeToken({ _id: user._id, roles: user.roles });

            res.status(200).send({ code: 200, status: 'success', token, user });
        } catch (err) {
            res.status(400).send({ code: 400, status: 'error', message: err });
        }
    }

    /**
     * @api {post} /v1/auth/forgot-password      Forgot Password
     * @apiName ForgotPassword
     * @apiVersion 1.0.0
     * @apiGroup Authentication
     *
     * @apiParam {String} email                 User's email
     *
     * @apiSuccess (Success 2xx) 200/OK         Success
     * @apiSuccessExample Success-Response:
     *   HTTP 200 OK
     *   {
     *     code: 200,
     *     status: 'success',
     *     message: 'Check your email in order to reset your password'
     *   }
     * @apiError 400/Bad-Request
     */
    public async forgotPassword (req: Request, res: Response) {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).send({ errors: errors.mapped() });

        try {
            const { email } = req.body;

            const user: IUser = await User.findOne({ email });
            const token: string = Token.forgotPasswordToken(user._id);
            const url: string = `${process.env.PASSWORD_URL}/reset-password/${token}`;

            await Email.sendEmail(email, { url }, 'forgotPassword');
        } catch (err) {
            console.error(err);
            res.status(400).send({ code: 400, status: 'error', message: err });
        }
    }

    /**
     * @api {post} /v1/auth/reset-password      Reset Password
     * @apiName ResetPassword
     * @apiVersion 1.0.0
     * @apiGroup Authentication
     *
     * @apiHeader {String} x-token              Reset password token.
     *
     * @apiParam {String} password              New user's password
     *
     * @apiSuccess (Success 2xx) 200/OK         Success
     * @apiSuccessExample Success-Response:
     *   HTTP 200 OK
     *   {
     *     code: 200,
     *     status: 'success',
     *     message: 'Password successfully updated'
     *   }
     * @apiError 400/Bad-Request
     */
    public async resetPassword (req: Request, res: Response) {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).send({ errors: errors.mapped() });

        try {
            const { password } = req.body;

            await User.findByIdAndUpdate(req['user']._id, { $set: { password } });

            res.status(200).send({ code: 200, status: 'success', message: 'Password successfully updated' });
        } catch (err) {
            res.status(400).send({ code: 400, status: 'error', message: err });
        }
    }

    /**
     * @api {get} /v1/auth/profile              User's profile
     * @apiName Profile
     * @apiVersion 1.0.0
     * @apiGroup Authentication
     *
     *
     * @apiSuccess (Success 2xx) 200/OK         Success
     * @apiSuccessExample Success-Response:
     *   HTTP 200 OK
     *   {
     *     code: 200,
     *     status: 'success',
     *     user: Object(email, password, username, roles, created_at, updated_at)
     *   }
     * @apiError 401/Unauthorized
     */
    public async profile (req: Request, res: Response) {
        res.status(200).send({ code: 200, status: 'success', user: req['user'] });
    }

    public routes(): void {
        this.router.post('/signup', [
            check('username').exists().trim(),
            check('email').exists().isEmail().trim().normalizeEmail(),
            check('password').exists()
        ], limiter, this.signUp);

        this.router.post('/login', [
            check('username').trim().optional(),
            check('email').isEmail().trim().normalizeEmail().optional(),
            check('password').exists()
        ], limiter, this.login);

        this.router.post('/forgot-password', [
            check('email').isEmail().trim().normalizeEmail().exists()
        ], limiter, this.forgotPassword);

        this.router.post('/reset-password', [
            check('password').exists()
        ], limiter, Authorization.isLogged, this.resetPassword);

        this.router.get('/profile', Authorization.isLogged, this.profile);
    }
}

const userRoutes = new UserRouter();
userRoutes.routes();

export default userRoutes.router;
