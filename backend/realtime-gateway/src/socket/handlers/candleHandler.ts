import { Socket } from 'socket.io';
import StockCandleManager from '../../managers/StockCandleManager';
import { WS_EVENT_CANDLE_INIT } from '../utils/constants';

export async function sendInitialCandles(socket: Socket, stockSymbol: string) {
    const candles = await StockCandleManager.getInstance().getCandles(stockSymbol);

    socket.emit(WS_EVENT_CANDLE_INIT, {
        symbol: stockSymbol,
        candles: candles,
    });
}