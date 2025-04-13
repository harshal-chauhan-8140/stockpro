import orderProcessor from './engine/orderProcessor';
import { redisStreamClient } from './redis';
import { cancelLimitOrder } from './services/orderCancellationService';
import { REDIS_STREAM, REDIS_STREAM_BLOCK, REDIS_STREAM_BLOCK_DURATION_MILISECOND, REDIS_STREAM_CONSUMER_NAME, REDIS_STREAM_GROUP, REDIS_STREAM_GROUP_NAME, REDIS_STREAM_ID, REDIS_STREAM_ORDER_CANCEL, REDIS_STREAM_ORDER_PROCESS } from './utils/constants';
import { formatMessage } from './utils/stream';
require("dotenv").config();

async function startListening() {
    while (true) {
        try {
            const messages = await redisStreamClient.xreadgroup(
                REDIS_STREAM_GROUP, REDIS_STREAM_GROUP_NAME, REDIS_STREAM_CONSUMER_NAME,
                REDIS_STREAM_BLOCK, REDIS_STREAM_BLOCK_DURATION_MILISECOND,
                REDIS_STREAM, REDIS_STREAM_ORDER_PROCESS, REDIS_STREAM_ORDER_CANCEL,
                REDIS_STREAM_ID, REDIS_STREAM_ID
            ) as [string, [string, string[]][]][] | null;

            if (!messages) continue;

            for (const [streamName, entries] of messages) {
                for (const [messageId, fieldArray] of entries) {
                    const data = formatMessage(fieldArray);

                    switch (streamName) {
                        case REDIS_STREAM_ORDER_PROCESS:
                            await orderProcessor(data);
                            break;
                        case REDIS_STREAM_ORDER_CANCEL:
                            await cancelLimitOrder(Number(data.id));
                            break;
                    }

                    await redisStreamClient.xack(streamName, REDIS_STREAM_GROUP_NAME, messageId);
                }
            }
        } catch (error: any) {
            console.error('❌ Redis stream error:', error.message);
        }
    }
}

startListening();