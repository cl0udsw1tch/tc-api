import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authRepository } from './repository';

const JWT_SECRET = process.env.JWT_SECRET!;

export const authService = {
    async signup(email: string, password: string) {
        const existing = await authRepository.findByEmail(email);
        if (existing) throw new Error('EMAIL_TAKEN');

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await authRepository.create(email, passwordHash);
        return signToken(user.id);
    },

    async login(email: string, password: string) {
        const user = await authRepository.findByEmail(email);
        if (!user) throw new Error('INVALID_CREDENTIALS');

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) throw new Error('INVALID_CREDENTIALS');

        return signToken(user.id);
    },
};

function signToken(userId: string) {
    return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}
