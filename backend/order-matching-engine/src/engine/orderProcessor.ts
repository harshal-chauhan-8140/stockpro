import { orderBook } from '../manager/OrderBookManager';
import { orderTransformer } from '../transformer/orderTransformer';
import matchOrder from './matchEngine';
import { publishUpdatedTopOrders } from '../services/orderBookService';

export default async function orderProcessor(rawOrder: Record<string, string>) {
    try {
        const order = orderTransformer(rawOrder);

        orderBook.addOrder(order);

        await matchOrder(order);

        await publishUpdatedTopOrders(order.stockId);

    } catch (error: any) {
        console.error('❌ Failed to process order:', error.message);
    }
}
