import { prismaClient } from "../";
import redisClient from "../../redis";
import seedPortfolioHoldings from "./seedPortfolioHoldings";
import seedCandlesAndInitializeRedis from "./seedStockCandles";
import seedStocks from "./seedStocks";
import seedUsers from "./seedUsers";

(async () => {
    try {
        await seedUsers();
        console.log("✅ Users seeded");

        await seedStocks();
        console.log("✅ Stocks seeded");

        await seedCandlesAndInitializeRedis();
        console.log("✅ Candles seeded and Redis initialized");

        await seedPortfolioHoldings();
        console.log("✅ Portfolio holdings seeded");
    } catch (e) {
        console.error("❌ Error during seeding:", e);
    } finally {
        await prismaClient.$disconnect();
        await redisClient.quit();
    }
})();
