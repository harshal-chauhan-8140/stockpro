import axios from "axios";
import { API_CONNECTION_HOST_URL, AUTH_LOGIN_ENDPOINT, AUTH_SIGNUP_ENDPOINT } from "../utils/contants";

async function login(email, password) {
    const response = await axios.post(`${API_CONNECTION_HOST_URL}${AUTH_LOGIN_ENDPOINT}`, {
        email,
        password,
    });

    return response.data;
}

async function signup(name, email, password) {
    const response = await axios.post(`${API_CONNECTION_HOST_URL}${AUTH_SIGNUP_ENDPOINT}`, {
        name,
        email,
        password,
    });

    return response.data;
}

export { login, signup };