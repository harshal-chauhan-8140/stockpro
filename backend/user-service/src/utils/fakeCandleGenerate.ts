export type Candle = {
    open: number;
    high: number;
    low: number;
    close: number;
    timestamp: Date;
};

export function generateFakeCandles(intervalSeconds = 5, minutes = 5): Candle[] {
    const candles: Candle[] = [];
    const now = new Date(); // current UTC time
    const totalCandles = (minutes * 60) / intervalSeconds;

    let lastClose = randomPrice(900, 1100);

    for (let i = totalCandles - 1; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * intervalSeconds * 1000);
        const open = lastClose;
        const high = open + randomDelta();
        const low = open - randomDelta();
        const close = randomPrice(low, high);

        candles.push({
            open: round(open),
            high: round(high),
            low: round(low),
            close: round(close),
            timestamp: timestamp,
        });

        lastClose = close;
    }

    return candles;
}

function randomPrice(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

function randomDelta(): number {
    return Math.random() * 10;
}

function round(val: number): number {
    return Math.round(val * 100) / 100;
}
