import { Request, Response } from 'express';
import { prismaClient } from '../db';
import { sendResponse } from '../utils/response';
import { HttpError } from '../errors/HTTPError';
import redisClient from '../redis';

export const getCurrentPortfolio = async (req: Request, res: Response): Promise<any> => {
    const userId = req.userId;

    const user = await prismaClient.user.findUnique({
        where: { id: userId },
        include: {
            holdings: {
                include: {
                    stock: true,
                },
            },
        },
    });

    if (!user) throw new HttpError(404, `No user found with given userId: ${userId}.`);

    const groupedHoldings: Record<string, {
        stockId: number;
        stockName: string;
        stockSymbol: string;
        totalQuantity: number;
        totalReservedQuantity: number;
        totalPrice: number;
    }> = {};

    for (const holding of user.holdings) {
        const stock = holding.stock;
        if (!stock) continue;

        const symbol = stock.symbol;

        if (!groupedHoldings[symbol]) {
            groupedHoldings[symbol] = {
                stockId: stock.id,
                stockName: stock.name,
                stockSymbol: symbol,
                totalQuantity: 0,
                totalReservedQuantity: 0,
                totalPrice: 0,
            };
        }

        groupedHoldings[symbol].totalQuantity += holding.quantity;
        groupedHoldings[symbol].totalReservedQuantity += holding.reservedQuantity;
        groupedHoldings[symbol].totalPrice += holding.price.toNumber() * holding.quantity;
    }

    const portfolio = await Promise.all(
        Object.values(groupedHoldings).map(async (item) => {
            const redisKey7d = `stock:candles:7d:${item.stockSymbol}`;
            const candlesJson = await redisClient.get(redisKey7d);
            const candles = candlesJson ? JSON.parse(candlesJson) : [];
            const candlesClose = candles.map((c: any) => parseFloat(c.close));

            return {
                stockId: item.stockId,
                stockName: item.stockName,
                stockSymbol: item.stockSymbol,
                quantity: item.totalQuantity,
                reservedQuantity: item.totalReservedQuantity,
                avgPrice: (item.totalPrice / item.totalQuantity).toFixed(2),
                candlesClose,
            };
        })
    );

    return sendResponse(res, {
        statusCode: 200,
        status: "success",
        message: "User portfolio fetched and grouped successfully.",
        data: {
            availableCash: user.availableBalance.toFixed(2),
            reservedCash: user.reservedBalance.toFixed(2),
            portfolio,
        },
    });
};

export const addFunds = async (req: Request, res: Response): Promise<any> => {
    const userId = req.userId;
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) throw new HttpError(400, "Invalid amount provided.");

    const user = await prismaClient.user.update({
        where: { id: userId },
        data: {
            availableBalance: {
                increment: parseFloat(amount),
            },
        },
    });

    return sendResponse(res, {
        statusCode: 200,
        status: "success",
        message: `Successfully added ₹${amount} to your account.`,
        data: {
            availableBalance: user.availableBalance.toFixed(2),
        },
    });
};

export const removeFunds = async (req: Request, res: Response): Promise<any> => {
    const userId = req.userId;
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) throw new HttpError(400, "Invalid amount provided.");

    const user = await prismaClient.user.findUnique({
        where: { id: userId },
    });

    if (!user) throw new HttpError(404, "User not found.");

    if (user.availableBalance.toNumber() < parseFloat(amount)) throw new HttpError(400, "Insufficient balance to remove the requested amount.");

    const updatedUser = await prismaClient.user.update({
        where: { id: userId },
        data: {
            availableBalance: {
                decrement: parseFloat(amount),
            },
        },
    });

    return sendResponse(res, {
        statusCode: 200,
        status: "success",
        message: `Successfully removed ₹${amount} from your account.`,
        data: {
            availableBalance: updatedUser.availableBalance.toFixed(2),
        },
    });
};
