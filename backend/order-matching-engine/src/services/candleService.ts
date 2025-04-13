import { prismaClient } from '../db';
import { redisCommandClient } from '../redis';
import { publishCandleUpdate } from '../redis/publisher';
import StockManager from '../manager/StockManager';
import StockCandleManager from '../manager/StockCandleManager';
import { Candle } from '../types';
import { REDIS_KEY_STOCK_CANDLE_LIVE_PREFIX } from '../utils/constants';

const stockCandleManager = StockCandleManager.getInstance();

function getRedisKey(symbol: string): string {
    return `${REDIS_KEY_STOCK_CANDLE_LIVE_PREFIX}:${symbol}`;
}

export async function generateTradeCandle(stockId: number, price: number, quantity: number): Promise<void> {
    const symbol = await getStockSymbol(stockId);
    if (!symbol) return;

    const lastCandle = await stockCandleManager.getLastCandle(symbol);
    const open = lastCandle ? lastCandle.close : price;

    await createAndSaveCandle(stockId, symbol, price, quantity, open);
}

export async function getLastCandleFromCache(symbol: string): Promise<any | null> {
    const redisKey = getRedisKey(symbol);
    const cached = await redisCommandClient.get(redisKey);
    const candles = cached ? JSON.parse(cached) : [];

    if (candles.length > 0) {
        return candles[candles.length - 1];
    }

    return null;
}

export async function createAndSaveCandle(
    stockId: number,
    symbol: string,
    price: number,
    quantity: number,
    open: number
): Promise<any> {
    const high = Math.max(open, price);
    const low = Math.min(open, price);
    const close = price;

    const newCandle: Candle = {
        stockId,
        timestamp: new Date(),
        open,
        high,
        low,
        close,
        volume: quantity,
    };

    await prismaClient.candle.create({ data: newCandle });

    const redisKey = getRedisKey(symbol);
    let candles: any[] = [];

    const cached = await redisCommandClient.get(redisKey);
    if (cached) {
        candles = JSON.parse(cached);
    }

    if (candles.length >= 60) {
        candles.shift();
    }

    candles.push(newCandle);
    await redisCommandClient.set(redisKey, JSON.stringify(candles));

    await publishCandleUpdate(symbol, newCandle);

    return newCandle;
}

async function getStockSymbol(stockId: number): Promise<string | null> {
    const stockManager = StockManager.getInstance();

    if (Object.keys(stockManager.getAll()).length === 0 || !stockManager.getStockById(stockId)) {
        await stockManager.init();
    }

    const stock = stockManager.getStockById(stockId);
    if (!stock) {
        console.error(`⚠️ Stock with ID ${stockId} not found`);
        return null;
    }

    return stock.symbol;
}
