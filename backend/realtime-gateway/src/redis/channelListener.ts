import { redisSubscriberClient } from ".";
import { ES_EVENT_ORDER_EXECUTION_UPDATE, REDIS_CHANNEL_CANDLE_PATTERN, REDIS_CHANNEL_ORDER_UPDATE, REDIS_CHANNEL_ORDERBOOK_PATTERN, REDIS_CHANNEL_PATTERNS, REDIS_CHANNEL_TRADE_PATTERN } from "../socket/utils/constants";
import ConnectionManager from "../managers/ConnectionManager";
import { sendCandleToRoom, sendOrderBookToRoom, sendTradeToRoom } from "../socket/utils/roomUtils";

const connectionManager = ConnectionManager.getInstance();

export default function initRedisChannelListeners() {
    redisSubscriberClient.psubscribe(...REDIS_CHANNEL_PATTERNS).then(() => {
        REDIS_CHANNEL_PATTERNS.forEach((pattern) => console.log(`✅ Subscribed to channel: ${pattern}`))
    });

    redisSubscriberClient.subscribe(REDIS_CHANNEL_ORDER_UPDATE).then(() => {
        console.log(`✅ Subscribed to channel: ${REDIS_CHANNEL_ORDER_UPDATE}`);
    });

    redisSubscriberClient.on('pmessage', (pattern, channel, message) => {
        const [, type, symbol] = channel.split(':');
        const payload = JSON.parse(message.toString());

        switch (pattern) {
            case REDIS_CHANNEL_CANDLE_PATTERN:
                sendCandleToRoom(payload, symbol);
                break;
            case REDIS_CHANNEL_ORDERBOOK_PATTERN:
                sendOrderBookToRoom(payload, symbol);
                break;
            case REDIS_CHANNEL_TRADE_PATTERN:
                sendTradeToRoom(payload, symbol);
                break;
            default:
                console.warn(`❓ Unknown channel type: ${type}`);
        }
    });

    redisSubscriberClient.on('message', (channel, message) => {
        if (channel !== REDIS_CHANNEL_ORDER_UPDATE) return;

        try {
            const payload = JSON.parse(message.toString());
            const { userId } = payload;

            const socket = connectionManager.getSocket(userId);
            if (socket) {
                socket.emit(ES_EVENT_ORDER_EXECUTION_UPDATE, payload);
                console.log(`📤 Sent order update to user ${userId}`);
            } else {
                console.warn(`⚠️ No socket found for user ${userId}`);
            }
        } catch (err) {
            console.error('❌ Failed to parse Redis message:', err);
        }
    });
}