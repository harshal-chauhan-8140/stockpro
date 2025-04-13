import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ROOM_PREFIX_ORDERBOOK, TRANSPORT_WEBSOCKET, WS_CONNECTION_HOST_URL, WS_EVENT_CONNECT, WS_EVENT_CONNECTION_ERROR, WS_EVENT_ORDERBOOK, WS_EVENT_ROOM_JOIN } from '../utils/contants';

export default function useOrderBookSocket() {
    const { symbol } = useParams();
    const token = useSelector((state) => state.user.accessToken);

    const [orderBook, setOrderBook] = useState({ BUY: [], SELL: [] });

    useEffect(() => {
        if (!symbol || !token) return;

        const socket = io(WS_CONNECTION_HOST_URL, {
            transports: [TRANSPORT_WEBSOCKET],
            query: { token },
        });

        socket.on(WS_EVENT_CONNECT, () => {
            socket.emit(WS_EVENT_ROOM_JOIN, { roomName: `${ROOM_PREFIX_ORDERBOOK}:${symbol}` });
        });

        socket.on(WS_EVENT_ORDERBOOK, (data) => {
            if (data.symbol !== symbol) return;

            const buy = data.orderBook.BUY || data.orderBook.buy || [];
            const sell = data.orderBook.SELL || data.orderBook.sell || [];

            setOrderBook({ BUY: buy, SELL: sell });
        });

        socket.on(WS_EVENT_CONNECTION_ERROR, (err) => {
            console.error("orderbook socket error:", err.message);
        });

        return () => {
            socket.disconnect();
        };
    }, [symbol, token]);

    return orderBook;
}