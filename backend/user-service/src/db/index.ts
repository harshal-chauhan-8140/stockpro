import { PrismaClient, User } from "@prisma/client";

const prismaClient = new PrismaClient();

export { prismaClient, User };