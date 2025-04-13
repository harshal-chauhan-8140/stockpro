import { createClient } from 'redis';

const isProd = process.env.NODE_ENV === 'production';

const REDIS_HOST = isProd ? process.env.REDIS_HOST_PROD : process.env.REDIS_HOST_DEV;
const REDIS_PORT = isProd ? process.env.REDIS_PORT_PROD : process.env.REDIS_PORT_DEV;
const REDIS_PASSWORD = isProd ? process.env.REDIS_PASSWORD_PROD : undefined;

const redisClient = createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
    password: REDIS_PASSWORD,
    // ...(isProd && {
    //     socket: {
    //         tls: true,
    //         host: REDIS_HOST,
    //         port: Number(REDIS_PORT),
    //     },
    // }),
});

redisClient.on('error', (err) => {
    console.error('❌ Redis error:', err);
});

(async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('✅ Redis connected (cache + stream compatible)');
    }

    const createGroupIfNotExists = async (stream: string, group: string) => {
        try {
            await redisClient.xGroupCreate(stream, group, '$', { MKSTREAM: true });
            console.log(`✅ Created consumer group '${group}' on stream '${stream}'`);
        } catch (err: any) {
            if (err?.message?.includes('BUSYGROUP')) {
                console.log(`ℹ️ Group '${group}' already exists on stream '${stream}'`);
            } else if (err?.message?.includes('ERR')) {
                console.error(`❌ Redis group creation error on '${stream}':`, err.message);
            } else {
                console.error('❌ Unknown error:', err);
            }
        }
    };

    await createGroupIfNotExists('order:process', 'order');
    await createGroupIfNotExists('order:cancel', 'order');
})();


export default redisClient;