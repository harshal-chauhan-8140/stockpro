import { Socket } from "socket.io";
import { io } from "../../app";
import { ROOM_PREFIX_CANDLE, ROOM_PREFIX_ORDERBOOK, ROOM_PREFIX_TRADE, WS_EVENT_CANDLE_UPDATE, WS_EVENT_ORDERBOOK, WS_EVENT_TRADE } from "./constants";

async function joinRoom(socket: Socket, prefix: string, stockSymbol: string) {
    const room = `${prefix}:${stockSymbol.toUpperCase()}`;
    socket.join(room);
}

function leaveRoom(socket: Socket, prefix: string, stockSymbol: string) {
    const room = `${prefix}:${stockSymbol.toUpperCase()}`;
    socket.join(room);
    console.log(`✅ User ${socket.data.userId} left the room: ${room}`);
}

function isValidRoomPrefix(prefix: string): boolean {
    return [ROOM_PREFIX_CANDLE, ROOM_PREFIX_TRADE, ROOM_PREFIX_ORDERBOOK].includes(prefix);
}

function sendOrderBookToRoom(orderBook: any, stockSymbol: string) {
    io.to(`${ROOM_PREFIX_ORDERBOOK}:${stockSymbol}`).emit(WS_EVENT_ORDERBOOK, {
        symbol: stockSymbol,
        orderBook
    });
}

function sendCandleToRoom(candle: any, stockSymbol: string) {
    io.to(`${ROOM_PREFIX_CANDLE}:${stockSymbol}`).emit(WS_EVENT_CANDLE_UPDATE, {
        symbol: stockSymbol,
        candle
    });
}

function sendTradeToRoom(trade: any, symbol: string) {
    io.to(`${ROOM_PREFIX_TRADE}:${symbol}`).emit(WS_EVENT_TRADE, {
        symbol,
        trade
    });
}

export {
    joinRoom,
    leaveRoom,
    isValidRoomPrefix,
    sendCandleToRoom,
    sendOrderBookToRoom,
    sendTradeToRoom
};