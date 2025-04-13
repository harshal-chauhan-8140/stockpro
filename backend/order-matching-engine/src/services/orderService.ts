import { ORDER_STATUS, prismaClient } from '../db';
import { Order } from '../types';

export async function updateOrderStatusAndQty(order: Order, matchedQty: number, newStatus: ORDER_STATUS) {
    console.log(`📦 Updating Order ID ${order.id} → +${matchedQty} filled, Status: ${newStatus}`);

    await prismaClient.order.update({
        where: { id: order.id },
        data: {
            filledQuantity: { increment: matchedQty },
            status: newStatus,
        },
    });

    order.filledQuantity += matchedQty;
    order.status = newStatus;
}
