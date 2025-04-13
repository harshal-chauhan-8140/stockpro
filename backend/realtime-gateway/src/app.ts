import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
require("dotenv").config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: { origin: '*' }
});

export { app, httpServer, io };
