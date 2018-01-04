import { sign, verify } from 'jsonwebtoken';
import { IPayload } from '../interfaces/IPayload';

class Token {
    public static encodeToken(payload: object): string {
        const token: string = sign(payload, process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_EXP });

        return token;
    }

    public static decodeToken(token: string): any {
        const decoded = verify(token, process.env.SECRET_KEY);

        return decoded;
    }

    public static forgotPasswordToken(_id: string): string {
        const token: string = sign({ _id }, process.env.SECRET_KEY, { expiresIn: '10m' });

        return token;
    }
}

export default Token;
