import { io } from '../app';
import authSocketMiddleware from './middleware/authMiddleware';
import ConnectionManager from '../managers/ConnectionManager';
import StockManager from '../managers/StockManager';
import { JoinRoomPayload } from '../types';
import { ROOM_PREFIX_CANDLE, ROOM_PREFIX_ORDERBOOK, WS_EVENT_CONNECTION, WS_EVENT_DISCONNECT, WS_EVENT_LEAVE_ROOM, WS_EVENT_ROOM_JOIN } from './utils/constants';
import { isValidRoomPrefix, joinRoom, leaveRoom } from './utils/roomUtils';
import initRedisChannelListeners from '../redis/channelListener';
import { sendInitialCandles } from './handlers/candleHandler';
import { sendInitialOrderBook } from './handlers/orderBookHandler';

const connectionManager = ConnectionManager.getInstance();
const stockManager = StockManager.getInstance();

export async function initSocketServer() {
    io.use(authSocketMiddleware);

    io.on(WS_EVENT_CONNECTION, (socket) => {

        socket.on(WS_EVENT_ROOM_JOIN, async function (joinRoomPayload) {
            try {
                const [roomNamePrefix, stockSymbol] = joinRoomPayload.roomName.split(':');
                const isValidStockSymbol = await stockManager.isValidStockSymbol(stockSymbol);

                if (!joinRoomPayload ||
                    !isValidRoomPrefix(roomNamePrefix) ||
                    !isValidStockSymbol
                ) return;

                joinRoom(socket, roomNamePrefix, stockSymbol);

                switch (roomNamePrefix) {
                    case ROOM_PREFIX_CANDLE:
                        await sendInitialCandles(socket, stockSymbol);
                        break;
                    case ROOM_PREFIX_ORDERBOOK:
                        sendInitialOrderBook(socket, stockSymbol);
                        break;
                }
            } catch (err) {
                console.error(`❌ Error handling ${WS_EVENT_ROOM_JOIN}:`, err);
                return;
            }
        });

        socket.on(WS_EVENT_LEAVE_ROOM, async function (message) {
            try {
                const joinRoomPayload: JoinRoomPayload = JSON.parse(message);
                const [roomNamePrefix, stockSymbol] = joinRoomPayload.roomName.split(':');
                const isValidStockSymbol = await stockManager.isValidStockSymbol(stockSymbol);

                if (!joinRoomPayload ||
                    !isValidRoomPrefix(roomNamePrefix) ||
                    !isValidStockSymbol
                ) return;

                leaveRoom(socket, roomNamePrefix, stockSymbol);
            } catch (err) {
                console.error(`❌ Error handling ${WS_EVENT_LEAVE_ROOM}:`, err);
                return;
            }
        })

        socket.on(WS_EVENT_DISCONNECT, () => {
            connectionManager.remove(socket.data.id);
        });
    });

    initRedisChannelListeners();
}
