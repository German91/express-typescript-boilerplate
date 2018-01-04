require('dotenv').config();

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as methodOverride from 'method-override';
import * as helmet from 'helmet';
import * as logger from 'morgan';
import * as cors from 'cors';
import * as compression from 'compression';
import * as path from 'path';

import Database from './database/db';

// Import routes
import UserRoutes from './routes/UserRouter';

class Server {
    public app: express.Application;

    constructor() {
        this.app = express();

        this.config();
        this.routes();
        this.database();
    }

    public config(): void {
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(methodOverride());
        this.app.use(compression());
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(logger('dev'));
    }

    public routes(): void {
        const router: express.Router = express.Router();

        this.app.use('/', express.static(__dirname + '/../apidoc'));
        this.app.use('/api/v1/auth', UserRoutes);
    }

    public database(): void {
        Database.connect();
    }
}

export default new Server().app;
