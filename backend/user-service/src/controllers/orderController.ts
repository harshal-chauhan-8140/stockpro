import { Request, Response } from 'express';
import { prismaClient } from '../db';
import { EXECUTION_TYPE, SIDE_TYPE, ORDER_STATUS } from '@prisma/client';
import { HttpError } from '../errors/HTTPError';
import { sendResponse } from '../utils/response';
import { publishOrderCancelToStream, publishOrderToStream } from '../redis/streamPublisher';

const bufferAmountPercentage = Number(process.env.MARKET_BUY_ORDER_BUFFER_AMOUNT_PERCENTAGE);

export const createOrder = async (req: Request, res: Response): Promise<any> => {
    const userId = req.userId!;

    let { stockId, side, execution, price, quantity } = req.body;
    console.log(req.body)

    if (!stockId || !side || !execution || !price || !quantity) {
        throw new HttpError(400, 'Missing required fields: stockId, side, execution, price, quantity.');
    }

    side = String(side).toUpperCase();
    execution = String(execution).toUpperCase();

    let reservedAmount = 0;

    const order = await prismaClient.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
            where: { id: userId },
        });

        if (!user) throw new HttpError(404, 'User not found.');

        if (side === SIDE_TYPE.BUY) {
            reservedAmount = execution === EXECUTION_TYPE.MARKET
                ? price * quantity * bufferAmountPercentage
                : price * quantity;

            if (user.availableBalance.toNumber() < reservedAmount) {
                throw new HttpError(400, 'Insufficient funds for this BUY order.');
            }

            await tx.user.update({
                where: { id: userId },
                data: {
                    availableBalance: {
                        decrement: reservedAmount,
                    },
                    reservedBalance: {
                        increment: reservedAmount,
                    },
                },
            });
        }

        if (side === SIDE_TYPE.SELL) {
            const holdings = await tx.portfolioHolding.findMany({
                where: {
                    userId,
                    stockId,
                },
                orderBy: {
                    purchasedAt: 'asc',
                },
            });

            const totalAvailableQty = holdings.reduce((sum, h) => sum + h.quantity, 0);

            if (totalAvailableQty < quantity) throw new HttpError(400, 'Insufficient stock quantity to sell.');

            let remainingQty = quantity;

            for (const holding of holdings) {
                if (holding.quantity <= 0) continue;

                const toReserve = Math.min(remainingQty, holding.quantity);

                await tx.portfolioHolding.update({
                    where: { id: holding.id },
                    data: {
                        reservedQuantity: {
                            increment: toReserve,
                        },
                        quantity: {
                            decrement: toReserve
                        }
                    },
                });

                remainingQty -= toReserve;
                if (remainingQty === 0) break;
            }
        }

        const order = await tx.order.create({
            data: {
                userId,
                stockId,
                side,
                execution,
                price,
                quantity,
                filledQuantity: 0,
                status: ORDER_STATUS.PENDING,
                isIoc: false,
                reservedAmount,
            },
        });

        return order;
    });

    let orderId = order.id;

    await publishOrderToStream({ id: orderId, userId, stockId, quantity, price, side, execution });

    return sendResponse(res, {
        statusCode: 201,
        status: 'success',
        message: 'Order created successfully.',
        data: order,
    });
};

export const cancelOrder = async (req: Request, res: Response): Promise<any> => {
    const userId = req.userId;
    const { orderId } = req.params;

    if (!orderId) throw new HttpError(400, 'Order ID missing in parameter.');


    const order = await prismaClient.order.findUnique({
        where: {
            id: Number(orderId),
            userId: userId
        },
    });

    if (!order) throw new HttpError(404, `Order not found with given order ID: ${orderId}. `);

    if (order.status === ORDER_STATUS.FILLED || order.status === ORDER_STATUS.CANCELLED) {
        throw new HttpError(400, `Cannot cancel order with status '${order.status}'.`);
    }

    await publishOrderCancelToStream(order.id);

    return sendResponse(res, {
        statusCode: 200,
        status: 'success',
        message: 'Order cancelled successfully.'
    });
};