export default function OrderBook({ BUY, SELL }) {
    const buyTotal = BUY.reduce((sum, o) => sum + o.quantity, 0);
    const sellTotal = SELL.reduce((sum, o) => sum + o.quantity, 0);
    const total = buyTotal + sellTotal;

    const buyPercent = total > 0 ? (buyTotal / total) * 100 : 50;
    const sellPercent = total > 0 ? (sellTotal / total) * 100 : 50;

    return (
        <div className="text-sm h-full flex flex-col border rounded p-2">
            <div className="flex justify-between font-semibold px-2 mb-1">
                <span>Price</span>
                <span>Quantity</span>
            </div>

            <div className="h-40 flex flex-col-reverse gap-1 overflow-hidden text-red-600">
                {SELL.slice(0, 8).map((order, index) => (
                    <div key={index} className="flex justify-between px-2">
                        <span>{order.price}</span>
                        <span>{order.quantity}</span>
                    </div>
                ))}
            </div>

            <div className="my-2 text-center font-bold text-black">
                {BUY[0]?.price ?? "--"} T
            </div>

            <div className="h-40 flex flex-col gap-1 overflow-hidden text-green-600">
                {BUY.slice(0, 8).map((order, index) => (
                    <div key={index} className="flex justify-between px-2">
                        <span>{order.price}</span>
                        <span>{order.quantity}</span>
                    </div>
                ))}
            </div>

            <div className="mt-2 flex h-5 text-white text-xs font-semibold">
                <div
                    className="bg-red-500 flex items-center justify-center"
                    style={{ width: `${sellPercent}%` }}
                >
                    {sellPercent.toFixed(0)}%
                </div>
                <div
                    className="bg-green-500 flex items-center justify-center"
                    style={{ width: `${buyPercent}%` }}
                >
                    {buyPercent.toFixed(0)}%
                </div>
            </div>
        </div>
    );
}