import { Request, Response } from 'express';
import { prismaClient } from '../db';
import redisClient from '../redis';
import { sendResponse } from '../utils/response';
import { updateDailyCandlesPerStock } from '../utils/updateDailyCandlesPerStock';

export const getStocksWithCandles = async (req: Request, res: Response): Promise<any> => {
    const stocks = await prismaClient.stock.findMany();

    const transformedStocks = await Promise.all(
        stocks.map(async (stock) => {
            const symbol = stock.symbol;
            const redisKey7d = `stock:candles:7d:${symbol}`;

            let candlesJson = await redisClient.get(redisKey7d);
            if (!candlesJson) {
                await updateDailyCandlesPerStock();
                candlesJson = await redisClient.get(redisKey7d);
            }

            const candles7Day = candlesJson ? JSON.parse(candlesJson) : [];

            const candlesClose = candles7Day.map((candle: any) => parseFloat(candle.close));
            const low7Day = Math.min(...candles7Day.map((candle: any) => parseFloat(candle.low)));
            const high7Day = Math.max(...candles7Day.map((candle: any) => parseFloat(candle.high)));

            const latestCandle = await prismaClient.candle.findFirst({
                where: { stockId: stock.id },
                orderBy: { timestamp: 'desc' },
                select: { close: true },
            });

            const currentPrice = latestCandle ? parseFloat(latestCandle.close.toString()) : 0;

            return {
                id: stock.id,
                symbol: symbol,
                companyName: stock.name,
                candlesClose,
                low7Day,
                high7Day,
                currentPrice,
            };
        })
    );

    return sendResponse(res, {
        statusCode: 200,
        status: 'success',
        message: 'Stocks with 7-day candles fetched successfully.',
        data: {
            stocks: transformedStocks,
        },
    });
};
