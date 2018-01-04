import * as rateLimit from 'express-rate-limit';

const limiter = new rateLimit({
    windowMs: 15*60*1000, // 15 minutes
    max: 50, // limit each IP to 100 request per windowMs
    delayMs: 0 // disable delaying - full speed until the max limit is reached
});

export default limiter;
