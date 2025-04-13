import axios from "axios";
import { API_CONNECTION_HOST_URL, PORTFOLIO_ENDPOINT, PORTFOLIO_FUND_ADD_ENDPOINT, PORTFOLIO_FUND_REMOVE_ENDPOINT } from "../utils/contants";

async function depositBalance(amount, token) {
    const response = await axios.post(`${API_CONNECTION_HOST_URL}${PORTFOLIO_FUND_ADD_ENDPOINT}`,
        { amount },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

    return response.data;
}

async function withdrawBalance(amount, token) {
    const response = await axios.post(
        `${API_CONNECTION_HOST_URL}${PORTFOLIO_FUND_REMOVE_ENDPOINT}`,
        { amount },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}

async function getUserPortfolio(token) {
    const response = await axios.get(`${API_CONNECTION_HOST_URL}${PORTFOLIO_ENDPOINT}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export { depositBalance, withdrawBalance, getUserPortfolio };