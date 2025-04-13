import { Order } from '../types';
import { ORDER_STATUS, SIDE_TYPE, Trade } from '../db';
import { createTrade } from '../services/tradeService';
import { updateOrderStatusAndQty } from '../services/orderService';
import { updateBalances } from '../services/balanceService';
import { generateTradeCandle } from '../services/candleService';
import { updateSellerHoldings, createBuyerHolding } from '../services/portfolioService';
import { publishTrade } from '../redis/publisher';
import { orderBook } from '../manager/OrderBookManager';

export async function executeTrade(order: Order, opposite: Order, matchedQty: number, trades: Trade[]) {
    const tradePrice = order.side === SIDE_TYPE.BUY ? opposite.price : order.price;

    const trade = await createTrade(order, opposite, matchedQty, tradePrice);
    trades.push(trade);

    const updatedOrderFilled = order.filledQuantity + matchedQty;
    const updatedOppositeFilled = opposite.filledQuantity + matchedQty;

    const orderStatus = updatedOrderFilled === order.quantity ? ORDER_STATUS.FILLED : ORDER_STATUS.PARTIAL;
    const oppositeStatus = updatedOppositeFilled === opposite.quantity ? ORDER_STATUS.FILLED : ORDER_STATUS.PARTIAL;

    await updateOrderStatusAndQty(order, matchedQty, orderStatus);
    await updateOrderStatusAndQty(opposite, matchedQty, oppositeStatus);

    const buyOrder = order.side === SIDE_TYPE.BUY ? order : opposite;
    const sellOrder = order.side === SIDE_TYPE.SELL ? order : opposite;

    await updateBalances(buyOrder, sellOrder, tradePrice, matchedQty);
    await updateSellerHoldings(sellOrder, matchedQty);
    await createBuyerHolding(buyOrder.userId, buyOrder.stockId, matchedQty, tradePrice);

    await generateTradeCandle(order.stockId, tradePrice, matchedQty);
    await publishTrade(trade, order.stockId);

    order.filledQuantity = updatedOrderFilled;
    opposite.filledQuantity = updatedOppositeFilled;
    order.status = orderStatus;
    opposite.status = oppositeStatus;

    if (orderStatus === ORDER_STATUS.FILLED) {
        orderBook.removeOrder(order.stockId, order.id, order.side);
    }
    if (oppositeStatus === ORDER_STATUS.FILLED) {
        orderBook.removeOrder(opposite.stockId, opposite.id, opposite.side);
    }
}