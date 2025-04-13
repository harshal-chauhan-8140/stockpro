import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { ORDER_BOUGHT, ORDER_SIDE_BUY, ORDER_SOLD, ORDER_STATUS_FILLED, TRANSPORT_WEBSOCKET, WS_CONNECTION_HOST_URL, WS_EVENT_CONNECT, WS_EVENT_CONNECTION_ERROR, WS_EVENT_ORDER_EXECUTION_UPDATE } from '../utils/contants';

export default function useOrderExecutionListener() {
    const token = useSelector((state) => state.user.accessToken);

    useEffect(() => {
        if (!token) return;

        const socket = io(WS_CONNECTION_HOST_URL, {
            transports: [TRANSPORT_WEBSOCKET],
            query: { token },
        });

        socket.on(WS_EVENT_CONNECT, () => {

        });

        socket.on(WS_EVENT_ORDER_EXECUTION_UPDATE, (data) => {

            if (!data) {
                console.warn("Received empty execution data");
                return
            }

            const { quantity, status, side } = data;

            const verb = side === ORDER_SIDE_BUY ? ORDER_BOUGHT : ORDER_SOLD;

            if (status === ORDER_STATUS_FILLED) {
                toast.success(`✅ Entire quantity ${verb}.`);
            } else {
                toast.success(`ℹ️ ${quantity} quantity ${verb}.`);
            }
        });

        socket.on(WS_EVENT_CONNECTION_ERROR, (err) => {
            console.error("Order execution update socket error:", err.message);
        });

        return () => {
            socket.disconnect();
        };
    }, [token]);
}
