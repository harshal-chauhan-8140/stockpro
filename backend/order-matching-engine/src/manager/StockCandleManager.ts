import { getLastCandleFromCache, createAndSaveCandle } from '../services/candleService';
import { Candle } from '../types';

class StockCandleManager {
    private static instance: StockCandleManager;
    private lastCandleCache: Record<string, Candle> = {};

    private constructor() { }

    public static getInstance(): StockCandleManager {
        if (!this.instance) {
            this.instance = new StockCandleManager();
        }
        return this.instance;
    }

    public async getLastCandle(symbol: string): Promise<any | null> {
        if (this.lastCandleCache[symbol]) {
            return this.lastCandleCache[symbol];
        }

        const lastCandle = await getLastCandleFromCache(symbol);
        if (lastCandle) {
            this.lastCandleCache[symbol] = lastCandle;
        }

        return lastCandle;
    }

    public async createCandle(stockId: number, symbol: string, price: number, quantity: number): Promise<void> {
        const lastCandle = await this.getLastCandle(symbol);
        const open = lastCandle ? lastCandle.close : price;

        const newCandle = await createAndSaveCandle(stockId, symbol, price, quantity, open);

        this.lastCandleCache[symbol] = newCandle;
    }
}

export default StockCandleManager;
