import { LightWeighOrderBookSide, lightWeightOrder } from "../types";

export default class OrderBookManager {
    private static instance: OrderBookManager;
    private orderBookMap: Map<string, LightWeighOrderBookSide> = new Map();

    private constructor() { }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new OrderBookManager();
        }
        return this.instance;
    }

    public updateOrderBook(symbol: string, orderBookMap: LightWeighOrderBookSide) {
        this.orderBookMap.set(symbol.toUpperCase(), orderBookMap);
    }

    public getOrderBook(symbol: string) {
        return this.orderBookMap.get(symbol) ?? { BUY: [], SELL: [] };
    }
}
