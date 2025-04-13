import { useForm } from "react-hook-form";
import { Button, Input } from "../../components";

export default function SignupForm({ onSubmit }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Input
                    placeHolder="Name"
                    {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
            </div>

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
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
            </div>

            <div>
                <Input
                    placeHolder="Password"
                    type="password"
                    {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Minimum 6 characters" },
                    })}
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
            </div>

            <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
                Signup
            </Button>
        </form>
    );
}
