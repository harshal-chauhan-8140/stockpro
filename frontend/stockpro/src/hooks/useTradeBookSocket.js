import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ROOM_PREFIX_TRADE, TRANSPORT_WEBSOCKET, WS_CONNECTION_HOST_URL, WS_EVENT_CONNECT, WS_EVENT_CONNECTION_ERROR, WS_EVENT_ROOM_JOIN, WS_EVENT_TRADE } from '../utils/contants';

export default function useTradeBookSocket() {
    const { symbol } = useParams();
    const token = useSelector((state) => state.user.accessToken);
    const [trades, setTrades] = useState([]);

    useEffect(() => {
        if (!symbol || !token) return;

        const socket = io(WS_CONNECTION_HOST_URL, {
            transports: [TRANSPORT_WEBSOCKET],
            query: { token },
        });

        socket.on(WS_EVENT_CONNECT, () => {
            socket.emit(WS_EVENT_ROOM_JOIN, { roomName: `${ROOM_PREFIX_TRADE}:${symbol}` });
        });

        socket.on(WS_EVENT_TRADE, (data) => {
            const time = new Date().toLocaleTimeString();
            const newTrade = { ...data.trade, time };
            setTrades((prev) => [newTrade, ...prev]);
        });

        socket.on(WS_EVENT_CONNECTION_ERROR, (err) => {
            console.error("TradeBook socket error :", err.message);
        });

        return () => {
            socket.disconnect();
        };
    }, [symbol, token]);

    return trades;
}
