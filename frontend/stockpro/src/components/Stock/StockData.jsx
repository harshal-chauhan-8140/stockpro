import { StockSmallChart } from "../index";
import { useNavigate } from "react-router-dom";

export default function StockData({
    companyName,
    stockSymbol,
    candlesClose = [],
    currentPrice,
    low7DaysOrTotalHoldings,
    high7DaysOrCurrentProfitAndLoss,
    stockId,
}) {
    console.log(low7DaysOrTotalHoldings)
    const navigate = useNavigate();

    const handleRowClick = () => {
        navigate(`/trade/${stockSymbol}/${stockId}`);
    };

    return (
        <tr
            onClick={handleRowClick}
            className="hover:bg-gray-50 cursor-pointer transition"
        >
            <td className="py-3 px-4 font-medium">{companyName}</td>
            <td>
                <div className="w-[160px] h-[50px] flex items-center justify-center mx-auto">
                    <StockSmallChart candlesClose={candlesClose} width={160} height={50} />
                </div>
            </td>
            <td className="text-center">{currentPrice}</td>
            <td className="text-center">{low7DaysOrTotalHoldings}</td>
            <td className="text-center">{high7DaysOrCurrentProfitAndLoss}</td>
        </tr>
    );
}
