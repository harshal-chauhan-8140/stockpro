import { Server, Socket } from 'socket.io';

export default class ConnectionManager {
    private static instance: ConnectionManager;
    private userSocketMap: Map<number, Socket> = new Map();
    private io!: Server;

    private constructor() { }

    public static getInstance(): ConnectionManager {
        if (!ConnectionManager.instance) {
            ConnectionManager.instance = new ConnectionManager();
        }
        return ConnectionManager.instance;
    }

    public init(io: Server): void {
        this.io = io;
    }

    public add(userId: number, socket: Socket): void {
        this.userSocketMap.set(userId, socket);
    }

    public remove(userId: number): void {
        this.userSocketMap.delete(userId);
    }

    public getSocket(userId: number): Socket | undefined {
        return this.userSocketMap.get(userId);
    }

    public sendToUser(userId: number, event: string, data: any): void {
        const socket = this.userSocketMap.get(userId);
        if (socket) {
            socket.emit(event, data);
        }
    }

    public sendToRoom(room: string, event: string, data: any): void {
        this.io.to(room).emit(event, data);
    }
}