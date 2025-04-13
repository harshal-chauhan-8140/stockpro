import { useForm } from "react-hook-form";
import { Input, Button } from "./index";

export default function TransactionForm({
    availableBalance = 0,
    placeHolder = "",
    registerInputField = "",
    onSubmit
}) {
    const { register, handleSubmit, reset } = useForm();

    const handleFormSubmit = (data) => {
        onSubmit(data);
        reset();
    };

    return (
        <div className="h-[80vh] flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-sm bg-white p-6 rounded shadow">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                    Available balance: <span className="font-bold text-blue-600">₹{availableBalance}</span>
                </h2>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="relative">
                        <Input
                            className="w-full"
                            type="number"
                            placeHolder={placeHolder}
                            {...register(registerInputField, { required: true })}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {registerInputField}
                    </Button>
                </form>
            </div>
        </div>
    );
}
