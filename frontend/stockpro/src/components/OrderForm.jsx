import { useForm } from "react-hook-form";
import { Input, Button } from "./index";

export default function OrderForm({ onSubmit, isMarketOrder }) {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <form className="flex flex-col items-center" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full">
                <Input
                    type="number"
                    placeholder="Quantity"
                    className="my-3"
                    {...register("quantity", { required: "Quantity is required" })}
                />
                {errors.quantity && (
                    <p className="text-red-500 text-sm mt-1 text-left">
                        {errors.quantity.message}
                    </p>
                )}
            </div>

            {!isMarketOrder && (
                <div className="w-full">
                    <Input
                        type="number"
                        placeholder="Price"
                        className="my-3"
                        {...register("price", { required: "Price is required" })}
                    />
                    {errors.price && (
                        <p className="text-red-500 text-sm mt-1 text-left">
                            {errors.price.message}
                        </p>
                    )}
                </div>
            )}

            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                Make Order
            </Button>
        </form>
    );
}