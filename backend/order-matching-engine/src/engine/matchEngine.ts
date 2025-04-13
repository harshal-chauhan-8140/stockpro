import { orderBook } from '../manager/OrderBookManager';
import { Order } from '../types';
import { EXECUTION_TYPE, Trade } from '../db';
import { executeTrade } from './tradeExecutor';
import { cancelMarketOrder } from '../services/orderCancellationService';
import { publishOrderUpdate } from '../redis/publisher';

function isPriceMatch(incoming: Order, opposite: Order): boolean {
    if (incoming.execution === EXECUTION_TYPE.MARKET) return true;

    return incoming.side === 'BUY'
        ? incoming.price >= opposite.price
        : incoming.price <= opposite.price;
}

function calculateMatchedQuantity(order: Order, opposite: Order): number {
    const orderAvailableQty = order.quantity - order.filledQuantity;
    const oppositeAvailableQty = opposite.quantity - opposite.filledQuantity;

    return Math.min(orderAvailableQty, oppositeAvailableQty);
}

export default async function matchOrder(order: Order) {
    console.log(`⚙️  Matching Order ID: ${order.id} | Type: ${order.execution} | Side: ${order.side}`);

    const oppositeOrders = orderBook.getOppositeOrders(order.stockId, order.side);
    const trades: Trade[] = [];

    for (const opposite of oppositeOrders) {
        if (order.userId === opposite.userId) continue;

        if (!isPriceMatch(order, opposite)) break;

        const matchedQty = calculateMatchedQuantity(order, opposite);
        if (matchedQty <= 0) continue;

        await executeTrade(order, opposite, matchedQty, trades);
        await publishOrderUpdate(order, matchedQty);
        await publishOrderUpdate(opposite, matchedQty);

        if (order.filledQuantity >= order.quantity) break;
    }

    console.log("✅ Final status of order:", order.status);

    if (order.execution === EXECUTION_TYPE.MARKET && order.filledQuantity < order.quantity) {
        await cancelMarketOrder(order, trades);
    }
}