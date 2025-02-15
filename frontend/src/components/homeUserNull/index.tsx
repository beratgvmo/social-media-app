import { useForm } from "react-hook-form";
import axios from "@/utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { TbChessFilled } from "react-icons/tb";
import InputLabel from "../Input/label";
import TextInput from "../Input";
import InputError from "../Input/error";

interface LoginFormData {
    email: string;
    password: string;
}
const HomeUserNull: React.FC = () => {
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
            console.log(response.data);
            const profile = await axios.get("/user/profile");
            setUser(profile.data);
            navigate("/");
        } catch (error) {
            setErrorMessage("Hatalı e-posta veya şifre. Yeniden deneyin");
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className="h-screen w-full flex justify-center items-center">
            <div className="flex flex-col w-1/2 items-center">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-gray-800">
                        Sosyal Medya'ya Hoş Geldiniz!
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Bağlantılarınızı güçlendirin ve yeni insanlarla tanışın.
                    </p>
                </div>
            </div>
            <div className="w-1/2 h-full flex items-center justify-center">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
                >
                    <div className="w-full flex items-center justify-center">
                        <TbChessFilled size={45} className="text-blue-600" />
                    </div>
                    <div className="mt-6">
                        <TextInput
                            {...register("email", {
                                required: "Email gerekli.",
                            })}
                            placeholder="Email"
                            type="email"
                        />

                        <InputError
                            message={errors.email?.message}
                            className="mt-1"
                        />
                    </div>
                    <div className="mt-4">
                        <TextInput
                            {...register("password", {
                                required: "Şifre gerekli.",
                            })}
                            placeholder="Şifre"
                            type="password"
                        />

                        <InputError
                            message={errors.password?.message}
                            className="mt-1"
                        />
                    </div>
                    <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
                    <div className="mt-5">
                        <button className="w-full py-2.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 font-semibold">
                            Giriş Yap
                        </button>

                        <p className="text-center text-sm text-gray-600 mt-1.5">
                            Hesabınız yok mu?{" "}
                            <a
                                href="/register"
                                className="text-blue-500 hover:underline"
                            >
                                Kayıt Ol
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HomeUserNull;
