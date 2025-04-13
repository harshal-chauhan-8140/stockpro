import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../services/authService";
import { login as loginUser, loading } from "../app/userSlice";
import LoginForm from "../components/Auth/LoginForm";
import { API_RESPONSE_STATUS_SUCCESS } from "../utils/contants";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (formData) => {
        try {
            dispatch(loading());

            const response = await login(formData.email, formData.password);

            if (response.status === API_RESPONSE_STATUS_SUCCESS) {
                const userData = {
                    user: response.data.user,
                    accessToken: response.data.accessToken,
                };
                dispatch(loginUser(userData));
                localStorage.setItem("user", JSON.stringify(userData));
                toast.success("Logged in successfully!");
                navigate("/stocks");
            }
        } catch (error) {
            const message =
                error?.response?.data?.message || "Login failed, please try again later.";
            toast.error(message);
        } finally {
            dispatch(loading());
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow w-1/3">
                <h1 className="text-xl font-bold text-center text-blue-600 mb-4">
                    Login
                </h1>
                <LoginForm onSubmit={handleLogin} />
            </div>
        </div>
    );
}
