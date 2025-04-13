import { useState } from "react";
import useTradeBookSocket from "../../hooks/useTradeBookSocket";
import { Button, OrderBook, TradeBook } from "../index";
import useOrderBookSocket from "../../hooks/useOrderBookSocket";

export default function OrderTradeBook() {
    const [isOrderBook, setIsOrderBook] = useState(true);

    const trades = useTradeBookSocket();
    const { BUY, SELL } = useOrderBookSocket();

    return (
        <div className="h-full p-4 flex flex-col">
            <div className="flex mb-4 gap-2">
                <button
                    className={`flex-1 py-2 rounded ${isOrderBook ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setIsOrderBook(true)}
                >
                    Order Book
                </button>
                <button
                    className={`flex-1 py-2 rounded ${!isOrderBook ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setIsOrderBook(false)}
                >
                    Trade Book
                </button>
            </div>

            <div className="flex-grow">
                {isOrderBook ? <OrderBook BUY={BUY} SELL={SELL} /> : <TradeBook trades={trades} />}
            </div>
        </div>
    );
}
