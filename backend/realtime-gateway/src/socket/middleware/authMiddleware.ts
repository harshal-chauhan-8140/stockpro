import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import jwt from 'jsonwebtoken';
import ConnectionManager from '../../managers/ConnectionManager';
import { JwtPayload } from '../../types';

const authSocketMiddleware = (socket: Socket, next: (err?: ExtendedError) => void) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;

    if (!token) {
        return next(new Error('Authorization token missing or malformed.'));
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;

        const userId = parseInt(decoded.userId);

        const manager = ConnectionManager.getInstance();
        manager.add(userId, socket);

        socket.data.userId = userId;

        next();
    } catch (err) {
        return next(new Error('Invalid or expired token.'));
    }
};

export default authSocketMiddleware;