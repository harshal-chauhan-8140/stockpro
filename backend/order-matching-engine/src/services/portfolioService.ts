import { prismaClient } from '../db';
import { Order } from '../types';

export async function updateSellerHoldings(order: Order, matchedQty: number) {
    console.log(`📦 Deducting ${matchedQty} stocks from Seller:${order.userId}`);
    let remainingQty = matchedQty;

    const holdings = await prismaClient.portfolioHolding.findMany({
        where: {
            userId: order.userId,
            stockId: order.stockId,
            reservedQuantity: { gt: 0 },
        },
        orderBy: { purchasedAt: 'asc' },
    });

    for (const holding of holdings) {
        if (remainingQty <= 0) break;

        const releaseQty = Math.min(remainingQty, holding.reservedQuantity);

        await prismaClient.portfolioHolding.update({
            where: { id: holding.id },
            data: {
                reservedQuantity: { decrement: releaseQty },
            },
        });

        remainingQty -= releaseQty;
    }
}

export async function createBuyerHolding(buyerId: number, stockId: number, quantity: number, price: number) {
    console.log(`📈 Adding ${quantity} shares of stock ${stockId} to Buyer:${buyerId}`);
    await prismaClient.portfolioHolding.create({
        data: {
            userId: buyerId,
            stockId,
            quantity,
            price,
            purchasedAt: new Date(),
        },
    });
}
