import { useForm } from "react-hook-form";
import axios from "@/utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { TbChessFilled } from "react-icons/tb";
import TextInput from "@/components/Input";
import InputError from "@/components/Input/error";
import InputLabel from "@/components/Input/label";

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
    const { setUser, user, setAccessToken } = useAuthStore();

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const response = await axios.post("/auth/register", data);
            setAccessToken(response.data.accessToken);

            const profile = await axios.get("/user/profile");
            setUser(profile.data);
            navigate("/");
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
        <div className="flex flex-col sm:justify-center items-center pt-6 bg-amber-950/5 h-screen">
            <div className="w-full flex items-center justify-center">
                <TbChessFilled className="w-20 h-20 fill-current text-blue-600" />
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full sm:max-w-md mt-7 mb-20 px-6 py-4 bg-white shadow-md overflow-hidden rounded-lg"
            >
                <div>
                    <InputLabel htmlFor="name" value="Ad" />

                    <TextInput
                        {...register("name", {
                            required: "Name is required",
                            minLength: {
                                value: 3,
                                message: "Name must be at least 3 characters",
                            },
                        })}
                        placeholder="Name"
                    />

                    <InputError
                        message={errors.name?.message}
                        className="mt-1"
                    />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="Email" value="E-posta" />

                    <TextInput
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+$/,
                                message: "Invalid email format",
                            },
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
                    <InputLabel htmlFor="Email" value="Şifre" />

                    <TextInput
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message:
                                    "Password must be at least 6 characters",
                            },
                        })}
                        placeholder="Password"
                        type="password"
                    />

                    <InputError
                        message={errors.password?.message}
                        className="mt-1"
                    />
                </div>

                <div className="mt-5">
                    <button className="w-full py-2.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 font-semibold">
                        Kaydol
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-1.5">
                        Zaten bir hesabın var{" "}
                        <a
                            href="/login"
                            className="text-blue-500 hover:underline"
                        >
                            Giriş yap
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Register;
