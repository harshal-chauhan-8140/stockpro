import { Order } from '../types';
import { prismaClient, ORDER_STATUS, SIDE_TYPE, Trade } from '../db';
import { orderBook } from '../manager/OrderBookManager';

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

async function refundRemainingFunds(order: Order, trades: Trade[]) {
    const totalSpent = trades.reduce((sum, trade) => sum + trade.quantity * Number(trade.price), 0);
    const refund = order.reservedAmount - totalSpent;

    if (refund > 0) {
        console.log(`🔁 Refunding ₹${refund} to Buyer:${order.userId}`);
        await prismaClient.user.update({
            where: { id: order.userId },
            data: {
                availableBalance: { increment: refund },
                reservedBalance: { decrement: refund },
            },
        });
    }
}
