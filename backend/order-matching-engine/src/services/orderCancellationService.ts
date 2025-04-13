import { prismaClient, ORDER_STATUS, SIDE_TYPE, EXECUTION_TYPE, Trade } from '../db';
import { Order } from '../types';
import { orderBook } from '../manager/OrderBookManager';
import { prismaOrderTransformer } from '../transformer/orderTransformer';

export async function cancelMarketOrder(order: Order, trades: Trade[]) {
    console.log(`🚫 Cancelling remaining quantity of MARKET order ID: ${order.id}`);

    if (order.side === SIDE_TYPE.BUY) {
        await refundRemainingFunds(order, trades);
    }

    if (order.side === SIDE_TYPE.SELL) {
        let qtyToRelease = order.quantity - order.filledQuantity;

        const holdings = await prismaClient.portfolioHolding.findMany({
            where: {
                userId: order.userId,
                stockId: order.stockId,
                reservedQuantity: { gt: 0 },
            },
            orderBy: { purchasedAt: 'asc' },
        });

        for (const holding of holdings) {
            if (qtyToRelease <= 0) break;

            const releaseQty = Math.min(qtyToRelease, holding.reservedQuantity);

            await prismaClient.portfolioHolding.update({
                where: { id: holding.id },
                data: {
                    quantity: { increment: releaseQty },
                    reservedQuantity: { decrement: releaseQty },
                },
            });

            qtyToRelease -= releaseQty;
        }
    }

    await prismaClient.order.update({
        where: { id: order.id },
        data: { status: ORDER_STATUS.CANCELLED },
    });

    order.status = ORDER_STATUS.CANCELLED;
    orderBook.removeOrder(order.stockId, order.id, order.side);

    console.log(`✅ MARKET order ${order.id} cancelled & cleaned up.`);
}

/**
 * Cancels a LIMIT order (user-initiated) if not already filled.
 */
export async function cancelLimitOrder(orderId: number) {
    const order = await prismaClient.order.findUnique({
        where: { id: orderId },
    });

    if (!order) return;

    const transformedOrder = prismaOrderTransformer(order);

    if (!order) {
        throw new Error(`Order with ID ${orderId} not found`);
    }

    if (order.execution === EXECUTION_TYPE.MARKET) {
        throw new Error(`Market order cannot be cancelled manually.`);
    }

    if (order.status === ORDER_STATUS.FILLED || order.status === ORDER_STATUS.CANCELLED) {
        throw new Error(`Cannot cancel order with status: ${order.status}`);
    }

    if (order.side === SIDE_TYPE.BUY) {
        prismaOrderTransformer(order);
        await handleBuyOrderRefund(transformedOrder);
    } else if (order.side === SIDE_TYPE.SELL) {
        await handleSellOrderRelease(transformedOrder);
    }

    await prismaClient.order.update({
        where: { id: orderId },
        data: { status: ORDER_STATUS.CANCELLED },
    });

    orderBook.removeOrder(order.stockId, order.id, order.side);
    console.log(`❎ LIMIT order ${orderId} cancelled`);
}

async function refundRemainingFunds(order: Order, trades: Trade[]) {
    const totalSpent = trades.reduce((sum, trade) => sum + trade.quantity * Number(trade.price), 0);
    const refund = order.reservedAmount - totalSpent;

    if (refund > 0) {
        await prismaClient.user.update({
            where: { id: order.userId },
            data: {
                availableBalance: { increment: refund },
                reservedBalance: { decrement: refund },
            },
        });
    }
}

async function handleBuyOrderRefund(order: Order) {
    const trades = await prismaClient.trade.findMany({
        where: { buyOrderId: order.id },
    });

    const totalSpent = trades.reduce((sum, trade) => sum + trade.quantity * Number(trade.price), 0);
    const totalReserved = Number(order.price) * order.quantity;
    const refund = totalReserved - totalSpent;

    if (refund > 0) {
        await prismaClient.user.update({
            where: { id: order.userId },
            data: {
                availableBalance: { increment: refund },
                reservedBalance: { decrement: refund },
            },
        });
    }
}

async function handleSellOrderRelease(order: Order) {
    let quantityToRelease = order.quantity - order.filledQuantity;

    const holdings = await prismaClient.portfolioHolding.findMany({
        where: {
            userId: order.userId,
            stockId: order.stockId,
            reservedQuantity: { gt: 0 },
        },
        orderBy: { purchasedAt: 'asc' },
    });

    for (const holding of holdings) {
        if (quantityToRelease <= 0) break;

        const releasableQty = Math.min(quantityToRelease, holding.reservedQuantity);

        await prismaClient.portfolioHolding.update({
            where: { id: holding.id },
            data: {
                quantity: { increment: releasableQty },
                reservedQuantity: { decrement: releasableQty },
            },
        });

        quantityToRelease -= releasableQty;
    }
}
