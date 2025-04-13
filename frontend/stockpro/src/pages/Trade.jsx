import { useState } from "react";
import { OrderTradeBook, TradingChart, OrderForm } from "../components";
import useOrderExecutionListener from "../hooks/useOrderExecutionListener";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createOrder } from "../services/orderService";
import toast from "react-hot-toast";
import { API_RESPONSE_STATUS_SUCCESS } from "../utils/contants";

export default function Trade() {
    useOrderExecutionListener();

    const [isMarketOrder, setIsMarketOrder] = useState(true);
    const [isBuyOrder, setIsBuyOrder] = useState(true);

    const { stockId } = useParams();
    const token = useSelector((state) => state.user.accessToken);

    const handleOrderSubmit = async (formData) => {
        const orderPayload = {
            stockId: Number(stockId),
            side: isBuyOrder ? "buy" : "sell",
            execution: isMarketOrder ? "market" : "limit",
            price: Number(formData.price) || 1,
            quantity: Number(formData.quantity),
        };

        try {
            const res = await createOrder(orderPayload, token);

            if (res.status === API_RESPONSE_STATUS_SUCCESS) {
                toast.success(res.message || "Order created successfully.");
            } else {
                toast.error(res.message || "Order failed.");
            }
        } catch (err) {
            const message = err?.response?.data?.message || "Failed to place order.";
            toast.error(`❌ ${message}`);
            console.error("Order error:", err);
        }
    };

    return (
        <div className="h-full flex bg-gray-50 gap-4">
            <div className="flex-2 rounded-lg">
                <TradingChart />
            </div>

            <div className="flex-1 border-r bg-white">
                <OrderTradeBook />
            </div>

            <div className="flex-1 p-4 bg-white">
                <div className="flex gap-2 mb-4">
                    <button
                        className={`w-1/2 py-2 rounded ${isMarketOrder ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        onClick={() => setIsMarketOrder(true)}
                    >
                        Market
                    </button>
                    <button
                        className={`w-1/2 py-2 rounded ${!isMarketOrder ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        onClick={() => setIsMarketOrder(false)}
                    >
                        Limit
                    </button>
                </div>

                <div className="flex gap-2 mb-6">
                    <button
                        className={`w-1/2 py-2 rounded ${isBuyOrder ? "bg-green-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setIsBuyOrder(true)}
                    >
                        Buy
                    </button>
                    <button
                        className={`w-1/2 py-2 rounded ${!isBuyOrder ? "bg-red-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setIsBuyOrder(false)}
                    >
                        Sell
                    </button>
                </div>

                <OrderForm
                    isMarketOrder={isMarketOrder}
                    onSubmit={handleOrderSubmit}
                />
            </div>
        </div>
    );
}
