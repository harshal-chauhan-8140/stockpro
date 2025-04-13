import { TransactionForm } from "../components/index";
import { useSelector, useDispatch } from "react-redux";
import { depositBalance } from "../services/portfolioService";
import toast from "react-hot-toast";
import { updateAvailableBalance } from "../app/userSlice";
import { API_RESPONSE_STATUS_SUCCESS } from "../utils/contants";

export default function Deposit() {

    const availableBalance = useSelector(state => state.user.userData.availableBalance) || 0;
    const token = useSelector(state => state.user.accessToken);
    const dispatch = useDispatch();

    async function onDeposit(formData) {
        try {
            const response = await depositBalance(formData.deposit, token);
            if (response.status === API_RESPONSE_STATUS_SUCCESS) {
                toast.success(`${formData.deposit} amount added successfully.`);
            }
            dispatch(updateAvailableBalance({
                availableBalance: response.data.availableBalance
            }))
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Amount cannot be added, Please try again later.";
            console.error("deposit fetch error:", message);
            toast.error(message);
        }
    }

    return (
        <TransactionForm
            availableBalance={availableBalance}
            placeHolder="Enter amount to deposit"
            registerInputField="deposit"
            onSubmit={onDeposit}
        />
    );
}