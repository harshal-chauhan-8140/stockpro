import { prismaClient } from '../index';
import redisClient from '../../redis';

export default async function seedStocks() {
    console.log('📊 Seeding stocks...');

    const stocksData = [
        {
            symbol: 'TATASTEEL',
            name: 'Tata Steel Ltd',
        },
        {
            symbol: 'RELIANCE',
            name: 'Reliance Industries Ltd',
        },
        {
            symbol: 'ITC',
            name: 'ITC Ltd',
        },
    ];
    const redisKey = 'stocks:symbols';
    const redisHashKey = 'stocks';

    await prismaClient.stock.createMany({
        data: stocksData,
        skipDuplicates: true,
    });

    const stocks = await prismaClient.stock.findMany({
        select: { id: true, symbol: true }
    });

    await redisClient.del(redisKey);
    stocksData.forEach(async (stock) => await redisClient.rPush(redisKey, stock.symbol));
    stocks.forEach(async (stock) => await redisClient.hSet(redisHashKey, stock.id, stock.symbol));

    console.log('✅ 3 stocks seeded and added in redis list: Tata Steel, Reliance, ITC');
}