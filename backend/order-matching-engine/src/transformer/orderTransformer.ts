import { EXECUTION_TYPE, ORDER_STATUS, SIDE_TYPE, Order as PrismaOrder } from "../db";
import { LightWeightOrder, Order, OrderUpdatePayload } from "../types";

function orderTransformer(order: Record<string, string>): Order {
    return {
        id: Number(order.id),
        userId: Number(order.userId),
        stockId: Number(order.stockId),
        side: order.side as SIDE_TYPE,
        execution: order.execution as EXECUTION_TYPE,
        price: Number(order.price),
        quantity: Number(order.quantity),
        filledQuantity: Number(order.filledQuantity ?? 0),
        createdAt: new Date(order.createdAt),
        isIoc: order.isIoc === 'true',
        status: ORDER_STATUS.PENDING,
        reservedAmount: Number(order.reservedAmount ?? 0)
    };
}

function lightWeightOrderTransformer(orders: Order[]): LightWeightOrder[] {
    return orders.map(order => ({
        stockId: order.stockId,
        price: order.price,
        quantity: order.quantity,
        filledQuantity: order.filledQuantity,
    }));
}

function orderUpdatePayloadTransformer(order: Order, matchedQty: number): OrderUpdatePayload {
    return {
        orderId: order.id,
        userId: order.userId,
        stockId: order.stockId,
        price: order.price,
        side: order.side,
        execution: order.execution,
        quantity: matchedQty,
        status: order.status
    }
}

function prismaOrderTransformer(order: PrismaOrder): Order {
    return {
        id: order.id,
        userId: order.userId,
        stockId: order.stockId,
        side: order.side as SIDE_TYPE,
        execution: order.execution as EXECUTION_TYPE,
        price: Number(order.price),
        quantity: order.quantity,
        filledQuantity: order.filledQuantity ?? 0,
        createdAt: new Date(order.createdAt),
        isIoc: order.isIoc,
        status: order.status as ORDER_STATUS,
        reservedAmount: Number(order.reservedAmount ?? 0),
    };
}

export { orderTransformer, lightWeightOrderTransformer, orderUpdatePayloadTransformer, prismaOrderTransformer };