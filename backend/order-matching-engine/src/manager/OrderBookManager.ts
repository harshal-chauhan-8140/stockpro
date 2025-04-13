import { LightWeightOrderBookPayload, Order, OrderBookSide } from '../types';
import { SIDE_TYPE } from '../db';
import { lightWeightOrderTransformer } from "../transformer/orderTransformer";


export class OrderBookManager {
    private orderBooks: Map<number, OrderBookSide> = new Map();

    addOrder(order: Order): void {
        let orderBook = this.orderBooks.get(order.stockId);

        if (!orderBook) {
            orderBook = { BUY: [], SELL: [] };
        }

        if (order.side === SIDE_TYPE.BUY) {
            orderBook.BUY.push(order);

            orderBook.BUY.sort((a, b) => {
                if (b.price !== a.price) {
                    return b.price - a.price;
                }
                return a.createdAt.getTime() - b.createdAt.getTime();
            });
        } else {
            orderBook.SELL.push(order);

            orderBook.SELL.sort((a, b) => {
                if (a.price !== b.price) {
                    return a.price - b.price;
                }
                return a.createdAt.getTime() - b.createdAt.getTime();
            });
        }

        this.orderBooks.set(order.stockId, orderBook);
    }

    getOppositeOrders(stockId: number, side: SIDE_TYPE): Order[] {
        const orderBook = this.orderBooks.get(stockId);

        if (!orderBook) {
            return [];
        }

        if (side === SIDE_TYPE.BUY) {
            return orderBook.SELL;
        } else {
            return orderBook.BUY;
        }
    }

    removeOrder(stockId: number, orderId: number, side: SIDE_TYPE): void {
        const orderBook = this.orderBooks.get(stockId);

        if (!orderBook) {
            return;
        }

        if (side === SIDE_TYPE.BUY) {
            orderBook.BUY = orderBook.BUY.filter(order => order.id !== orderId);
        } else {
            orderBook.SELL = orderBook.SELL.filter(order => order.id !== orderId);
        }

        this.orderBooks.set(stockId, orderBook);
    }

    getTopOrders(stockId: number, limit: number = 10): LightWeightOrderBookPayload {
        const orderBook = this.orderBooks.get(stockId);
        if (!orderBook) return { buy: [], sell: [] };

        const topBuy = lightWeightOrderTransformer(orderBook.BUY.slice(0, limit));
        const topSell = lightWeightOrderTransformer(orderBook.SELL.slice(0, limit));

        return {
            buy: topBuy,
            sell: topSell
        };
    }
}

export const orderBook = new OrderBookManager();