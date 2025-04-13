import axios from "axios";
import { API_CONNECTION_HOST_URL, ORDER_CREATE_ENDPOINT } from "../utils/contants";

export async function createOrder(orderData, token) {
    console.log(orderData)
    const response = await axios.post(`${API_CONNECTION_HOST_URL}${ORDER_CREATE_ENDPOINT}`, orderData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
}