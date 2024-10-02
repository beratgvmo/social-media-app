import { useForm } from "react-hook-form";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

interface LoginFormData {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();
    const navigate = useNavigate();
    const { setUser, user, setTokens } = useAuthStore();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await axios.post("/auth/login", data);
            setUser(response.data.user);
            setTokens(response.data.accessToken, response.data.refreshToken);
        } catch (error) {
            setErrorMessage("Giriş hatası: Hatalı kullanıcı bilgileri");
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/profile");
        }
    }, [user, setUser]);

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-400 to-blue-500">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-6"
            >
                <h2 className="text-3xl font-bold text-center text-gray-700">
                    Login
                </h2>
                {errorMessage && (
                    <p className="text-red-500 text-center">{errorMessage}</p>
                )}
                <div>
                    <input
                        {...register("email", {
                            required: "Email is required",
                        })}
                        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        })}
                        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Password"
                        type="password"
                    />
                    {errors.password && (
                        <span className="text-red-500 text-sm">
                            {errors.password.message}
                        </span>
                    )}
                </div>
                <button className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 font-semibold">
                    Login
                </button>
                <p className="text-center text-gray-600">
                    Don't have an account?
                    <a
                        href="/register"
                        className="text-blue-500 hover:underline"
                    >
                        Register
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Login;
