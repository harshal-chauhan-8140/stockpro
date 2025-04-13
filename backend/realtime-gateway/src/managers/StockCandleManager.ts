import { Candle } from "../types";
import { redisCommandClient } from "../redis";

const REDIS_CANDLE_KEY_PREFIX = "stock:candles:live";

export default class StockCandleManager {
    private static instance: StockCandleManager;
    private stockCandleMap: Map<string, Candle[]> = new Map();

    private constructor() { }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new StockCandleManager();
        }
        return this.instance;
    }

    public addCandle(symbol: string, candle: Candle) {
        let candles = this.stockCandleMap.get(symbol);

        if (!candles) {
            candles = [candle];
        } else {
            if (candles.length >= 60) {
                candles.shift();
            }
            candles.push(candle);
        }

        this.stockCandleMap.set(symbol, candles);
    }

    public async getCandles(symbol: string): Promise<Candle[]> {
        const key = symbol.toUpperCase();
        const cached = this.stockCandleMap.get(key);

        if (cached && cached.length) {
            return cached;
        }

        const redisKey = `${REDIS_CANDLE_KEY_PREFIX}:${key}`;
        const raw = await redisCommandClient.get(redisKey);
        const candles: Candle[] = raw ? JSON.parse(raw) : [];

        if (candles.length) {
            this.stockCandleMap.set(key, candles);
        }

        return candles;
    }
}