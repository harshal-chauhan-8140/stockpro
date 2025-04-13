import Redis from 'ioredis';

const isProd = process.env.NODE_ENV === 'production';

const REDIS_HOST = isProd ? process.env.REDIS_HOST_PROD : process.env.REDIS_HOST_DEV;
const REDIS_PORT = isProd ? process.env.REDIS_PORT_PROD : process.env.REDIS_PORT_DEV;
const REDIS_PASSWORD = isProd ? process.env.REDIS_PASSWORD_PROD : undefined;


const redisOptions = {
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
    password: REDIS_PASSWORD
};

const redisCommandClient = new Redis(redisOptions);
const redisSubscriberClient = new Redis(redisOptions);

export { redisCommandClient, redisSubscriberClient };