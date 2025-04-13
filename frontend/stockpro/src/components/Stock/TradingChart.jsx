import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ROOM_PREFIX_CANDLE, TRANSPORT_WEBSOCKET, WS_CONNECTION_HOST_URL, WS_EVENT_CANDLE_INIT, WS_EVENT_CANDLE_UPDATE, WS_EVENT_CONNECT, WS_EVENT_CONNECTION_ERROR, WS_EVENT_ROOM_JOIN } from '../../utils/contants';

export default function TradingChart() {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const candleSeriesRef = useRef(null);
    const socketRef = useRef(null);

    const { symbol } = useParams();
    const token = useSelector((state) => state.user.accessToken);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { color: '#ffffff' },
                textColor: '#000',
            },
            grid: {
                vertLines: { color: '#eee' },
                horzLines: { color: '#eee' },
            },
            timeScale: {
                timeVisible: true,
            },
            priceScale: {
                borderColor: '#ccc',
                autoScale: true,
            },
        });

        chartRef.current = chart;
        candleSeriesRef.current = chart.addCandlestickSeries();
        chart.timeScale().fitContent();

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                chart.resize(width, height);
            }
        });

        resizeObserver.observe(chartContainerRef.current);

        return () => {
            resizeObserver.disconnect();
            chart.remove();
        };
    }, []);

    useEffect(() => {
        if (!symbol || !token) return;

        const socket = io(WS_CONNECTION_HOST_URL, {
            transports: [TRANSPORT_WEBSOCKET],
            query: { token },
        });
        socketRef.current = socket;

        socket.on(WS_EVENT_CONNECT, () => {
            socket.emit(WS_EVENT_ROOM_JOIN, { roomName: `${ROOM_PREFIX_CANDLE}:${symbol}` });
        });

        socket.on(WS_EVENT_CANDLE_INIT, ({ symbol: s, candles }) => {
            if (s !== symbol) return;

            const formatted = candles.map(c => ({
                time: Math.floor(new Date(c.timestamp || c.time).getTime() / 1000),
                open: +c.open,
                high: +c.high,
                low: +c.low,
                close: +c.close,
            }));

            candleSeriesRef.current.setData(formatted.slice(-40));
            chartRef.current.timeScale().fitContent();
        });

        socket.on(WS_EVENT_CANDLE_UPDATE, ({ symbol: s, candle }) => {
            if (s !== symbol) return;

            candleSeriesRef.current.update({
                time: Math.floor(new Date(candle.timestamp || candle.time).getTime() / 1000),
                open: +candle.open,
                high: +candle.high,
                low: +candle.low,
                close: +candle.close,
            });

            chartRef.current.timeScale().fitContent();
        });

        socket.on(WS_EVENT_CONNECTION_ERROR, (err) => {
            console.error("WebSocket error:", err.message);
        });

        return () => {
            socket.disconnect();
        };
    }, [symbol, token]);

    return (
        <div
            ref={chartContainerRef}
            className="w-full h-full"
        />
    );
}
