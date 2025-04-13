import redisClient from './index';

export const publishOrderToStream = async (order: {
    id: number;
    userId: number;
    stockId: number;
    quantity: number;
    price: number;
    side: string;
    execution: string;
}) => {
    await redisClient.xAdd('order:process', '*', {
        id: String(order.id),
        userId: String(order.userId),
        stockId: String(order.stockId),
        quantity: String(order.quantity),
        price: String(order.price),
        side: order.side,
        execution: order.execution,
    });

};

export const publishOrderCancelToStream = async (orderId: number) => {
    await redisClient.xAdd('order:cancel', '*', {
        id: String(orderId),
    });
};
