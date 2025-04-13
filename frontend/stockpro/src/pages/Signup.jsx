import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signup } from "../services/authService";
import { login as loginUser, loading } from "../app/userSlice";
import { SignupForm } from "../components/index";
import { API_RESPONSE_STATUS_SUCCESS } from "../utils/contants";

export default function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignup = async (formData) => {
        try {
            dispatch(loading());

            const response = await signup(
                formData.name,
                formData.email,
                formData.password
            );

            if (response.status === API_RESPONSE_STATUS_SUCCESS) {
                const userData = {
                    user: response.data.user,
                    accessToken: response.data.accessToken,
                };

                dispatch(loginUser(userData));
                localStorage.setItem("user", JSON.stringify(userData));
                toast.success("Signup successful!");
                navigate("/stocks");
            }
        } catch (error) {
            const message =
                error?.response?.data?.message || "Signup failed, please try again.";
            toast.error(message);
        } finally {
            dispatch(loading());
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow-md w-1/3">
                <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
                    Create an account
                </h1>
                <SignupForm onSubmit={handleSignup} />
            </div>
        </div>
    );
}
