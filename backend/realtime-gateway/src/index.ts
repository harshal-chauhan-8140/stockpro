import { httpServer } from './app';
import { initSocketServer } from './socket';
const PORT = process.env.PORT || 5000;

initSocketServer();

httpServer.listen(PORT, () => {
    console.log(`🚀 Realtime Gateway running on port ${PORT}`);
});