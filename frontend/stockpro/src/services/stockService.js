import axios from "axios";
import { API_CONNECTION_HOST_URL, STOCK_ENDPOINT } from "../utils/contants";

export async function getStocks() {
    const response = await axios.get(`${API_CONNECTION_HOST_URL}${STOCK_ENDPOINT}`);

    return response.data;
}