import { useForm } from "react-hook-form"
import { Input, Button } from "../index"
export default function LimitOrderForm() {

    const { register, handleSubmit, reset } = useForm();

    function onLimitOrder(data) {
        console.log(data);
        reset();
    }

    return (
        <form className="flex flex-col items-center" onSubmit={handleSubmit(onLimitOrder)}>
            <Input type="number" placeHolder="Quantity" className="my-3"
                {...register("quantity", {
                    required: true
                })} />

            <Input type="number" placeHolder="Price" className="my-3"
                {...register("price", {
                    required: true
                })} />

            <Button>
                Make Order
            </Button>
        </form>
    )
}