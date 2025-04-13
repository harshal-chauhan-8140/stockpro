import { redisCommandClient } from "../redis";
import { REDIS_KEY_STOCKS_HASH } from "../socket/utils/constants";

export default class StockManager {
    private static instance: StockManager;
    private stockSymbols: string[] = [];

    private constructor() { }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new StockManager();
        }
        return this.instance;
    }

    public async isValidStockSymbol(symbol: string): Promise<boolean> {
        if (this.stockSymbols.length === 0) {
            const stocks = await redisCommandClient.hgetall(REDIS_KEY_STOCKS_HASH);
            if (stocks) {
                this.stockSymbols = Object.values(stocks);
            }
        }

        return this.stockSymbols.includes(symbol);
    }
}