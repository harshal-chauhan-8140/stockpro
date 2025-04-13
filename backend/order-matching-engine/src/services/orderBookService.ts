import { orderBook } from '../manager/OrderBookManager';
import StockManager from '../manager/StockManager';
import { publishTopOrders } from '../redis/publisher';

export async function publishUpdatedTopOrders(stockId: number, limit: number = 10) {
    const stockManager = StockManager.getInstance();

    if (!stockManager.getStockById(stockId)) {
        await stockManager.init();
    }

    const symbol = stockManager.getSymbolById(stockId);
    if (!symbol) {
        console.error(`❌ Symbol not found for stockId ${stockId}`);
        return;
    }

    const topOrders = orderBook.getTopOrders(stockId, limit);
    await publishTopOrders(symbol, topOrders);
}
