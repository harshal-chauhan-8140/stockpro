import { Trade } from "../db";
import { LightWeightTrade } from "../types";

export function lightWeightTradeTransformer(trade: Trade): LightWeightTrade {
    return {
        quantity: trade.quantity,
        price: trade.price.toNumber()
    }
}