import { useForm } from "react-hook-form";
import { Input, Button } from "..";

export default function LoginForm({ onSubmit }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
                <Input
                    placeHolder="Email"
                    type="email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: "Invalid email format",
                        },
                    })}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <Input
                    placeHolder="Password"
                    type="password"
                    {...register("password", {
                        required: "Password is required",
                    })}
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
                Login
            </Button>
        </form>
    );
}