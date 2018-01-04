import { sign, verify } from 'jsonwebtoken';

class Token {
    public static encodeToken(payload: object): string {
        const token: string = sign(payload, process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_EXP });

        return token;
    }

    public static decodeToken(token: string): string | object {
        const decoded = verify(token, process.env.SECRET_KEY);

        return decoded;
    }
}

export default Token;
