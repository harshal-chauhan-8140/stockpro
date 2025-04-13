export default function TradeBook({ trades }) {
    return (
        <div className="text-sm h-full flex flex-col border rounded p-2">
            <div className="flex justify-between font-semibold px-2 mb-1">
                <span>Price</span>
                <span>Quantity</span>
                <span>Time</span>
            </div>

            <div className="flex-grow overflow-hidden flex flex-col gap-1 text-blue-800">
                {trades.slice(0, 15).map((trade, index) => (
                    <div key={index} className="flex justify-between px-2">
                        <span>{trade.price}</span>
                        <span>{trade.quantity}</span>
                        <span>{trade.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
