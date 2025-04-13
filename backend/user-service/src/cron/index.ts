import cron from 'node-cron';
import { updateDailyCandlesPerStock } from '../utils/updateDailyCandlesPerStock';

cron.schedule('* * * * *', async () => {
    try {
        console.log('🕒 Running daily candle updater...');
        await updateDailyCandlesPerStock();
    } catch (err) {
        console.error('❌ Cron job error:', err);
    }
});

export default cron;