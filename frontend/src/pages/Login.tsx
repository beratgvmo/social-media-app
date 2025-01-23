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
    const { setUser, user, setAccessToken } = useAuthStore();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await axios.post("/auth/login", data);
            setAccessToken(response.data.accessToken);
            const profile = await axios.get("/user/profile");
            setUser(profile.data);
            navigate("/");
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || "Giriş hatası.");
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

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
                        {...register("email", { required: "Email gerekli." })}
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
                            required: "Şifre gerekli.",
                        })}
                        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Şifre"
                        type="password"
                    />
                    {errors.password && (
                        <span className="text-red-500 text-sm">
                            {errors.password.message}
                        </span>
                    )}
                </div>
                <button className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 font-semibold">
                    Giriş Yap
                </button>
                <p className="text-center text-gray-600">
                    Hesabınız yok mu?{" "}
                    <a
                        href="/register"
                        className="text-blue-500 hover:underline"
                    >
                        Kayıt Ol
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Login;
