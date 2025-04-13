import { SIDE_TYPE, EXECUTION_TYPE, ORDER_STATUS } from "./db";

interface Order {
    id: number;
    userId: number;
    stockId: number;
    side: SIDE_TYPE;
    execution: EXECUTION_TYPE;
    isIoc: boolean;
    price: number;
    quantity: number;
    filledQuantity: number;
    createdAt: Date;
    status: ORDER_STATUS;
    reservedAmount: number;
}

interface LightWeightOrder {
    stockId: number;
    price: number;
    quantity: number;
    filledQuantity: number;
}

interface LightWeightOrderBookPayload {
    buy: LightWeightOrder[];
    sell: LightWeightOrder[];
}

interface OrderBookSide {
    BUY: Order[];
    SELL: Order[];
};

interface LightWeightTrade {
    price: number;
    quantity: number;
}

interface OrderUpdatePayload {
    orderId: number;
    userId: number;
    stockId: number;
    side: SIDE_TYPE;
    execution: EXECUTION_TYPE;
    price: number;
    quantity: number;
    status: ORDER_STATUS;
}

interface Candle {
    stockId: number;
    timestamp: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export {
    Order,
    OrderBookSide,
    LightWeightOrder,
    LightWeightTrade,
    OrderUpdatePayload,
    LightWeightOrderBookPayload,
    Candle
};