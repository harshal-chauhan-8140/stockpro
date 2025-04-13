import { PrismaClient, EXECUTION_TYPE, ORDER_STATUS, Order, SIDE_TYPE, PortfolioHolding, Trade, Stock } from "@prisma/client";

const prismaClient = new PrismaClient();

export { prismaClient, EXECUTION_TYPE, ORDER_STATUS, Order, SIDE_TYPE, PortfolioHolding, Trade, Stock };