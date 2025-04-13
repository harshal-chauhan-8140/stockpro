import bcrypt from 'bcrypt';
import { prismaClient } from '..';
import { generateRefreshToken } from '../../utils/token';

export default async function seedUsers() {
    console.log('👤 Seeding users...');

    const usersData = [];

    for (let i = 1; i <= 10; i++) {
        const name = `User${i}`;
        const email = `user${i}@example.com`;
        const rawPassword = `password${i}`;
        const hashedPassword = await bcrypt.hash(rawPassword, 10);
        const refreshToken = generateRefreshToken();
        const refreshTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        usersData.push({
            name,
            email,
            password: hashedPassword,
            availableBalance: 1_000_000 + i * 100_000,
            refreshToken,
            refreshTokenExpiresAt,
        });
    }

    await prismaClient.user.createMany({
        data: usersData,
        skipDuplicates: true,
    });

    console.log('✅ 10 users created with available balance > ₹10L');
}

seedUsers()
    .catch((e) => {
        console.error('❌ Error seeding users:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prismaClient.$disconnect();
    });
