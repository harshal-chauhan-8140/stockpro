import { prismaClient, SIDE_TYPE, Trade } from '../db';
import { Order } from '../types';

export async function createTrade(
    order: Order,
    opposite: Order,
    quantity: number,
    price: number
): Promise<Trade> {
    console.log(`💼 Creating trade: ${quantity} @ ₹${price}`);

    const trade = await prismaClient.trade.create({
        data: {
            buyOrderId: order.side === SIDE_TYPE.BUY ? order.id : opposite.id,
            sellOrderId: order.side === SIDE_TYPE.SELL ? order.id : opposite.id,
            quantity,
            price,
        },
    });

    return trade;
}
