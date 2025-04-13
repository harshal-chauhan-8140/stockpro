import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;

if (!ACCESS_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined in .env');
}

export const generateAccessToken = (userId: string) => {
    return jwt.sign({ userId }, ACCESS_SECRET, {
        expiresIn: '7d',
    });
};

export const generateRefreshToken = () => {
    return crypto.randomBytes(40).toString('hex');
};
