import { useEffect, useState } from "react";
import { StockTable } from "../components";
import { getStocks } from "../services/stockService";
import toast from "react-hot-toast";
import { getTransformedStocks } from "../transformers/stocksTransformer";
import { API_RESPONSE_STATUS_SUCCESS } from "../utils/contants";

export default function Stock() {
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await getStocks();
                if (response.status === API_RESPONSE_STATUS_SUCCESS) {
                    const transformedStocks = getTransformedStocks(response.data.stocks);
                    setStocks(transformedStocks);
                }
            } catch (error) {
                const message =
                    error?.response?.data?.message ||
                    "Stocks could not be fetched, please try again later.";
                toast.error(message);
            }
        })();
    }, []);

    return (
        <div>
            <StockTable stocks={stocks} />
        </div>
    );
}
