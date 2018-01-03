import * as mongoose from 'mongoose';

class Database {
    public db: any;
    private readonly _mongoUri: string = process.env.MONGODB_URI;

    constructor() {
        this.db = mongoose.connection;
    }

    public connect(): void {
        mongoose.connect(this._mongoUri);

        this.db.once('open', () => console.log('Connected to MongoDB server'));
        this.db.on('close', (err) => console.log('Unable to connect to MongoDB server', err));
    }
}

export default new Database();
