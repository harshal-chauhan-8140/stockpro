import { prismaClient, Stock } from '../db';

class StockManager {
    private static instance: StockManager;
    private stocks: Record<number, Stock> = {};

    private constructor() { }

    public static getInstance(): StockManager {
        if (!StockManager.instance) {
            StockManager.instance = new StockManager();
        }
        return StockManager.instance;
    }

    public async init() {
        const allStocks = await prismaClient.stock.findMany();
        this.stocks = Object.fromEntries(allStocks.map(stock => [stock.id, stock]));
    }

    public getStockById(stockId: number): Stock | undefined {
        return this.stocks[stockId];
    }

    public getSymbolById(stockId: number): string | undefined {
        return this.stocks[stockId]?.symbol;
    }

    public getAll(): Record<number, Stock> {
        return this.stocks;
    }
}

export default StockManager;
