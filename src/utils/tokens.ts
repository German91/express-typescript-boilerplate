import { sign, verify } from 'jsonwebtoken';

class Token {
    public static async encodeToken(payload: any, cb: Function): any {
        try {
            const token = await sign(payload, process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_EXP });
            return token;
        } catch (err) {
            return err;
        }
    }

    public static async decodeToken(token: string, cb: Function): string {
        try {
            const decoded = await verify(token, process.env.SECRET_KEY);
            return decoded;
        } catch (err) {
            return err;
        }
    }
}

export default Token;
