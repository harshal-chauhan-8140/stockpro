import { prismaClient } from "..";

export default async function seedPortfolioHoldings() {
    console.log('📦 Seeding portfolio holdings...');

    const stocks = await prismaClient.stock.findMany({
        where: {
            symbol: {
                in: ['TATASTEEL', 'RELIANCE', 'ITC'],
            },
        },
    });

    const users = await prismaClient.user.findMany();

    const priceMap: Record<string, number> = {
        TATASTEEL: 120.0,
        RELIANCE: 2300.0,
        ITC: 420.0,
    };

    const holdings = [];

    for (const user of users) {
        for (const stock of stocks) {
            holdings.push({
                userId: user.id,
                stockId: stock.id,
                quantity: 100_000,
                price: priceMap[stock.symbol],
                purchasedAt: new Date(),
            });
        }
    }

    await prismaClient.portfolioHolding.createMany({
        data: holdings,
        skipDuplicates: true,
    });

    console.log('✅ Portfolio holdings seeded successfully!');
}
