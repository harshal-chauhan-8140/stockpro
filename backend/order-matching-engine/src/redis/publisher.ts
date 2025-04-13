import { redisPublisherClient } from '../redis';
import { Trade } from '../db';
import { lightWeightTradeTransformer } from '../transformer/tradeTransformer';
import { orderUpdatePayloadTransformer } from '../transformer/orderTransformer';
import StockManager from '../manager/StockManager';
import { LightWeightOrderBookPayload } from '../types';
import { REDIS_CHANNEL_CANDLE_PREFIX, REDIS_CHANNEL_ORDER_UPDATE, REDIS_CHANNEL_ORDERBOOK_PREFIX, REDIS_CHANNEL_TRADE_PREFIX } from '../utils/constants';

const stockManager = StockManager.getInstance();

export async function publishTrade(trade: Trade, stockId: number) {
    const symbol = stockManager.getSymbolById(stockId);
    const channel = `${REDIS_CHANNEL_TRADE_PREFIX}:${symbol}`;
    const payload = lightWeightTradeTransformer(trade);

    await redisPublisherClient.publish(channel, JSON.stringify(payload));
}

export async function publishOrderUpdate(order: any, matchedQty: number) {
    const channel = REDIS_CHANNEL_ORDER_UPDATE;
    const payload = orderUpdatePayloadTransformer(order, matchedQty);

    await redisPublisherClient.publish(channel, JSON.stringify(payload));
}

export async function publishCandleUpdate(symbol: string, candle: any) {
    const channel = `${REDIS_CHANNEL_CANDLE_PREFIX}:${symbol}`;
    const payload = JSON.stringify(candle);

    await redisPublisherClient.publish(channel, payload);
}

export async function publishTopOrders(symbol: string, topOrders: LightWeightOrderBookPayload) {
    const channel = `${REDIS_CHANNEL_ORDERBOOK_PREFIX}:${symbol.toUpperCase()}`;
    const payload = JSON.stringify(topOrders);

    await redisPublisherClient.publish(channel, payload);
}