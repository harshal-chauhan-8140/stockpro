interface JwtPayload {
    userId: string;
}

interface RoomPayload {
    roomName: string;
    stockSymbol: string;
}

interface JoinRoomPayload {
    roomName: string;
}

interface Candle {
    stockId: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    timestamp: Date;
}

interface lightWeightOrder {
    stockId: number;
    price: number;
    quantity: number;
    filledQuantity: number;
}

interface LightWeighOrderBookSide {
    BUY: lightWeightOrder[];
    SELL: lightWeightOrder[];
};

export {
    JwtPayload,
    RoomPayload,
    Candle,
    LightWeighOrderBookSide,
    lightWeightOrder,
    JoinRoomPayload
};