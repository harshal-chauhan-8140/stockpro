import { prismaClient } from '../db';
import { Order } from '../types';

export async function updateBalances(buyOrder: Order, sellOrder: Order, price: number, quantity: number) {
    const totalCost = price * quantity;
    console.log(`💰 Transferring ₹${totalCost} from Buyer:${buyOrder.userId} to Seller:${sellOrder.userId}`);

    await prismaClient.user.update({
        where: { id: buyOrder.userId },
        data: {
            reservedBalance: { decrement: totalCost },
        },
    });

    await prismaClient.user.update({
        where: { id: sellOrder.userId },
        data: {
            availableBalance: { increment: totalCost },
        },
    });
}
