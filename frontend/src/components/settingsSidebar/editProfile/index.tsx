import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // Redirect için
import Button from "@/components/button";
import Modal from "@/components/Modal";
import { useAuthStore } from "@/store/useAuthStore";
import { useForm } from "react-hook-form";
import axios from "@/utils/axiosInstance";

type FormData = {
    name: string;
    bio: string;
};

interface EditProfileProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ isOpen, onClose }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>();

    const { user, setUser } = useAuthStore();
    const navigate = useNavigate(); // Yönlendirme için
    const [isChecked, setIsChecked] = useState(user.isPrivate);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const passwordInput = useRef(null);
    const [isDeleteModal, setDeleteModal] = useState(false);

    useEffect(() => {
        if (user) {
            reset({
                name: user.name ?? "",
                bio: user.bio ?? "",
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: FormData) => {
        try {
            const response = await axios.patch("/user/update-profile", data);
            setUser(response.data.user);
            onClose();
        } catch (error) {
            console.error("Profil güncellemesi başarısız:", error);
        }
    };

    const onSubmitPrivate = async () => {
        try {
            await axios.patch("/user/update-profile/private");
        } catch (error) {
            console.error("Profil güncellemesi başarısız:", error);
        }
    };

    const handleToggle = () => {
        setIsChecked(!isChecked);
        onSubmitPrivate();
    };

    const deleteUser = async (e) => {
        e.preventDefault();
        try {
            await axios.delete("/user/profile/delete", {
                data: { password },
            });

            setUser(null); // Kullanıcıyı Zustand'dan temizle
            navigate("/"); // Anasayfaya yönlendir
        } catch (error) {
            setError(error.response?.data?.message || "Bir hata oluştu");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Profil Düzenle"
            maxWidth="2xl"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="pt-5 px-6 gap-5 flex flex-col">
                    <div className="flex flex-col">
                        <label className="block mb-1 ml-1 text-sm font-medium text-gray-800">
                            Ad
                        </label>
                        <input
                            type="text"
                            placeholder="Adınız"
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-1 outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            {...register("name", {
                                required: "Ad alanı zorunludur",
                                maxLength: {
                                    value: 50,
                                    message: "Ad en fazla 50 karakter olabilir",
                                },
                            })}
                        />
                        {errors.name && (
                            <span className="text-red-500 text-sm mt-1">
                                {errors.name.message}
                            </span>
                        )}
                    </div>

                    <div className="mt-4 border-t-2 pt-4">
                        <header>
                            <h2 className="text-lg font-medium text-gray-900">
                                Hesabı Sil
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Hesabınız silindiğinde, tüm verileriniz ve
                                içerikleriniz kalıcı olarak silinecektir.
                            </p>
                        </header>
                        <Button
                            type="button"
                            variant="roundedRed"
                            className="bg-red-600 text-white mt-4 p-2 rounded"
                            onClick={() => setDeleteModal(true)}
                        >
                            Hesabı Sil
                        </Button>
                    </div>
                </div>
            </form>

            {/* Hesap Silme Onay Modal */}
            <Modal
                isOpen={isDeleteModal}
                onClose={() => setDeleteModal(false)}
                title="Hesabı Sil"
                maxWidth="xl"
            >
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Hesabınızı silmek istediğinizden emin misiniz?
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Lütfen işlemi onaylamak için şifrenizi girin.
                    </p>
                    <div className="mt-6">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            placeholder="Şifre"
                        />
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </div>
                    <div className="mt-6 flex gap-2.5 justify-end">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => setDeleteModal(false)}
                        >
                            Vazgeç
                        </Button>
                        <Button variant="roundedRed" type="submit">
                            Hesabı sil
                        </Button>
                    </div>
                </form>
            </Modal>
        </Modal>
    );
};

export default EditProfile;
