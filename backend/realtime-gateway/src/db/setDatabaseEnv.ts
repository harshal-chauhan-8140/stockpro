import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

const envFilePath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envFilePath });

const nodeEnv = process.env.NODE_ENV || 'development';

let targetDatabaseUrl: string | undefined;

if (nodeEnv === 'production') {
    targetDatabaseUrl = process.env.DATABASE_URL_PROD;
} else {
    targetDatabaseUrl = process.env.DATABASE_URL_DEV;
}

if (!targetDatabaseUrl) {
    throw new Error(`❌ DATABASE_URL_${nodeEnv.toUpperCase()} is not defined in src/.env`);
}

const envContent = fs.readFileSync(envFilePath, 'utf-8');
const envLines = envContent.split('\n');

const updatedLines = envLines.filter(
    (line) => !line.trim().startsWith('DATABASE_URL=')
);

updatedLines.push(`DATABASE_URL=${targetDatabaseUrl}`);

fs.writeFileSync(envFilePath, updatedLines.join('\n'));

console.log(`✅ DATABASE_URL set for '${nodeEnv}' in src/.env`);