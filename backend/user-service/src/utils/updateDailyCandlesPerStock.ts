import { prismaClient } from '../db';
import redisClient from '../redis';

const IST_OFFSET_MINUTES = 330;
const REDIS_EXPIRY_SECONDS = 86400;

function toIST(date: Date): Date {
    const utc = date.getTime();
    return new Date(utc + IST_OFFSET_MINUTES * 60 * 1000);
}

function getISTDayString(date: Date): string {
    const ist = toIST(date);
    return ist.toISOString().split('T')[0];
}

function getISTDayStart(date: Date): Date {
    const ist = toIST(date);
    return new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate()));
}

function getISTDayRange(date: Date): { start: Date; end: Date } {
    const istStart = getISTDayStart(date);
    const utcStart = new Date(istStart.getTime() - IST_OFFSET_MINUTES * 60 * 1000);
    const utcEnd = new Date(utcStart.getTime() + 24 * 60 * 60 * 1000 - 1);
    return { start: utcStart, end: utcEnd };
}

export const updateDailyCandlesPerStock = async () => {
    const stocks = await prismaClient.stock.findMany();
    const now = new Date();
    const todayISTStr = getISTDayString(now);
    const { start: utcTodayStart, end: utcTodayEnd } = getISTDayRange(now);
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

    for (const stock of stocks) {
        const redisKey = `stock:candles:7d:${stock.symbol}`;
        const cached = await redisClient.get(redisKey);
        let candles: any[] = cached ? JSON.parse(cached) : [];

        if (!cached || candles.length < 7) {
            const startRange = new Date(utcTodayStart.getTime() - SEVEN_DAYS_MS + 1);

            const recentCandles = await prismaClient.candle.findMany({
                where: {
                    stockId: stock.id,
                    timestamp: {
                        gte: startRange,
                        lte: utcTodayEnd,
                    },
                },
                orderBy: {
                    timestamp: 'desc',
                },
            });

            const dayMap = new Map<string, any>();

            for (const candle of recentCandles) {
                const dateStr = getISTDayString(new Date(candle.timestamp));
                if (!dayMap.has(dateStr)) {
                    dayMap.set(dateStr, candle);
                }
            }

            candles = Array.from(dayMap.entries())
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([_, candle]) => candle);

            await redisClient.set(redisKey, JSON.stringify(candles), { EX: REDIS_EXPIRY_SECONDS });
            continue;
        }

        const todayCandle = await prismaClient.candle.findFirst({
            where: {
                stockId: stock.id,
                timestamp: {
                    gte: utcTodayStart,
                    lte: utcTodayEnd,
                },
            },
            orderBy: {
                timestamp: 'desc',
            },
        });

        if (!todayCandle) {
            continue;
        }

        const todayIndex = candles.findIndex(
            (c) => getISTDayString(new Date(c.timestamp)) === todayISTStr
        );

        if (todayIndex !== -1) {
            candles[todayIndex] = todayCandle;
        } else {
            if (candles.length >= 7) {
                candles.shift();
            }
            candles.push(todayCandle);
        }

        candles = candles.sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        await redisClient.set(redisKey, JSON.stringify(candles), { EX: REDIS_EXPIRY_SECONDS });
    }
};
