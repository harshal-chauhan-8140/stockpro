import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserPortfolio } from "../services/portfolioService";
import { StockTable } from "../components";
import toast from "react-hot-toast";
import { getTransformedPortfolioStocks } from "../transformers/stocksTransformer";
import { API_RESPONSE_STATUS_SUCCESS } from "../utils/contants";

export default function Portfolio() {
    const token = useSelector((state) => state.user.accessToken);
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await getUserPortfolio(token);

                if (response.status === API_RESPONSE_STATUS_SUCCESS) {
                    const portfolio = response.data.portfolio;
                    const transformed = getTransformedPortfolioStocks(portfolio);
                    setStocks(stocks => transformed);
                }

            } catch (error) {
                console.error("Failed to fetch portfolio", error);
                toast.error("Failed to load portfolio data.");
            }
        })()
    }, []);

    return (
        <div>
            <StockTable stocks={stocks} isHome={false} />
        </div>
    );
}
