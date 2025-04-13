import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prismaClient } from '../db';
import { HttpError } from '../errors/HTTPError';

interface JwtPayload {
    userId: string;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new HttpError(401, 'Authorization token missing or malformed.'));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;

        const user = await prismaClient.user.findUnique({
            where: { id: parseInt(decoded.userId, 10) },
        });

        if (!user) {
            return next(new HttpError(401, 'User not found.'));
        }

        req.userId = user.id;
        return next();
    } catch (error) {
        return next(new HttpError(401, 'Invalid or expired token.'));
    }
};
