import toast from "react-hot-toast";
import { TransactionForm } from "../components/index";
import { withdrawBalance } from "../services/portfolioService";
import { useSelector, useDispatch } from "react-redux";
import { updateAvailableBalance } from "../app/userSlice";
import { API_RESPONSE_STATUS_SUCCESS } from "../utils/contants";

export default function Withdraw() {

    const availableBalance = useSelector(state => state.user.userData.availableBalance) || 0;
    const token = useSelector(state => state.user.accessToken);
    const dispatch = useDispatch();

    async function onWithdraw(formData) {
        try {
            const response = await withdrawBalance(formData.withdraw, token);
            if (response.status === API_RESPONSE_STATUS_SUCCESS) {
                toast.success(`${formData.withdraw} amount withdraw successfully.`);
            }
            dispatch(updateAvailableBalance({
                availableBalance: response.data.availableBalance
            }))
        } catch (error) {
            console.log(error)
            const message =
                error?.response?.data?.message ||
                "Amount cannot be withdraw, Please try again later.";
            console.error("withdraw fetch error:", message);
            toast.error(message);
        }
    }

    return (
        <TransactionForm
            availableBalance={availableBalance}
            placeHolder="Enter amount to withdraw"
            registerInputField="withdraw"
            onSubmit={onWithdraw}
        />
    );
}