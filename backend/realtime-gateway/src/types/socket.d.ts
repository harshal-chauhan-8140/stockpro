import 'socket.io';

declare module 'socket.io' {
    interface Socket {
        data: {
            userId: number;
        };
    }
}
