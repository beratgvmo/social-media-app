import { useForm } from "react-hook-form";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
}

const Register: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { setUser, user, setTokens } = useAuthStore();

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const response = await axios.post("/auth/register", data);
            setUser(response.data.user);
            setTokens(response.data.accessToken, response.data.refreshToken);
        } catch (error) {
            setErrorMessage("Kayıt başarısız: Bu email zaten kullanılıyor.");
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, setUser]);

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-400 to-blue-500">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-6"
            >
                <h2 className="text-3xl font-bold text-center text-gray-700">
                    Register
                </h2>

                {errorMessage && (
                    <p className="text-red-500 text-center">{errorMessage}</p>
                )}

                <div>
                    <input
                        {...register("name", {
                            required: "Name is required",
                            minLength: {
                                value: 3,
                                message: "Name must be at least 3 characters",
                            },
                        })}
                        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Name"
                    />
                    {errors.name && (
                        <span className="text-red-500 text-sm">
                            {errors.name.message}
                        </span>
                    )}
                </div>

                <div>
                    <input
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+$/,
                                message: "Invalid email format",
                            },
                        })}
                        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Email"
                        type="email"
                    />
                    {errors.email && (
                        <span className="text-red-500 text-sm">
                            {errors.email.message}
                        </span>
                    )}
                </div>

                <div>
                    <input
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message:
                                    "Password must be at least 6 characters",
                            },
                        })}
                        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Password"
                        type="password"
                    />
                    {errors.password && (
                        <span className="text-red-500 text-sm">
                            {errors.password.message}
                        </span>
                    )}
                </div>

                <button className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200 font-semibold">
                    Register
                </button>

                <p className="text-center text-gray-600">
                    Already have an account?{" "}
                    <a href="/login" className="text-green-500 hover:underline">
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Register;
