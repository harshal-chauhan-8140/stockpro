import { Socket } from 'socket.io';
import OrderBookManager from '../../managers/OrderBookManager';
import { WS_EVENT_ORDERBOOK } from '../utils/constants';

export function sendInitialOrderBook(socket: Socket, stockSymbol: string) {
    const orderBook = OrderBookManager.getInstance().getOrderBook(stockSymbol);
    socket.emit(WS_EVENT_ORDERBOOK, {
        symbol: stockSymbol,
        orderBook,
    });
}