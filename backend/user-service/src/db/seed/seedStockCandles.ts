import { prismaClient } from '..';
import redisClient from '../../redis';
import { subMinutes, subDays, startOfDay, addMinutes } from 'date-fns';

const REDIS_CANDLE_KEY_PREFIX = 'stock:candles:live';

function getBigPriceRange(base: number) {
    const direction = Math.random() > 0.5 ? 1 : -1;

    const bodySize = Math.random() * 10 + 5;
    const wickSize = Math.random() * 5 + 2;

    const open = parseFloat((base + direction * bodySize).toFixed(2));
    const close = parseFloat((base).toFixed(2));
    const high = parseFloat((Math.max(open, close) + wickSize).toFixed(2));
    const low = parseFloat((Math.min(open, close) - wickSize).toFixed(2));

    return { open, high, low, close };
}

function getRandomVolume(min = 5000, max = 20000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default async function seedCandlesAndInitializeRedis() {
    console.log('📊 Seeding candles and initializing Redis cache...');
    console.log('🧹 Clearing existing candles...');
    await prismaClient.candle.deleteMany();

    const stocks = await prismaClient.stock.findMany();

    if (!stocks.length) {
        console.error('❌ No stocks found in the database.');
        return;
    }

    for (const stock of stocks) {
        const now = new Date();

        const minuteCandles = [];
        let currentTime = subMinutes(now, 60);
        let lastClose = 100 + Math.random() * 50; // Start price

        while (currentTime < now) {
            const basePrice = lastClose + (Math.random() * 10 - 5); // Add some drift
            const { open, high, low, close } = getBigPriceRange(basePrice);
            const volume = getRandomVolume();

            minuteCandles.push({
                stockId: stock.id,
                open,
                high,
                low,
                close,
                volume,
                timestamp: new Date(currentTime),
            });

            lastClose = close;
            currentTime = addMinutes(currentTime, 1);
        }

        const dailyCandles = [];
        for (let i = 7; i >= 1; i--) {
            const day = subDays(now, i);
            const timestamp = startOfDay(day);
            const basePrice = 100 + Math.random() * 50;
            const { open, high, low, close } = getBigPriceRange(basePrice);
            const volume = getRandomVolume(10000, 50000);

            dailyCandles.push({
                stockId: stock.id,
                open,
                high,
                low,
                close,
                volume,
                timestamp,
            });
        }

        const allCandles = [...dailyCandles, ...minuteCandles];

        await prismaClient.candle.createMany({
            data: allCandles,
            skipDuplicates: true,
        });

        console.log(`✅ Seeded ${allCandles.length} candles for stock: ${stock.symbol}`);

        const redisKey = `${REDIS_CANDLE_KEY_PREFIX}:${stock.symbol}`;
        const latestCandles = allCandles
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .slice(-60);

        await redisClient.set(redisKey, JSON.stringify(latestCandles));
        console.log(`📦 Redis initialized with ${latestCandles.length} candles for ${stock.symbol}`);
    }

    console.log('🎉 All candles seeded and Redis initialized.');
}

