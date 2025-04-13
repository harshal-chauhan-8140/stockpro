import { StockData, StockTableHeader } from "../index";

export default function StockTable({ stocks = [], isHome = true }) {

    return (
        <div className="bg-white rounded shadow">
            <table className="w-full table-auto text-sm">
                <StockTableHeader isHome={isHome} />
                <tbody>
                    {stocks.map((item, index) => {
                        console.log(item)
                        return <StockData key={index} {...item} />
                    }
                    )}
                </tbody>
            </table>
        </div>
    );
}
