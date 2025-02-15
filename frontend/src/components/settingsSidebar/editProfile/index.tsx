import { useEffect, useRef, useState } from "react";
import Button from "@/components/button";
import Modal from "@/components/Modal";
import { useAuthStore } from "@/store/useAuthStore";
import { useForm } from "react-hook-form";
import axios from "@/utils/axiosInstance";
import { Navigate } from "react-router-dom";
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

    const onCloseDelete = () => {
        setDeleteModal(false);
    };

    const onSubmitPrivate = async () => {
        try {
            await axios.patch("/user/update-profile/private");
        } catch (error) {
            console.error("Profil güncellemesi başarısız:", error);
        }
    };

    const handleToggle = () => {
        const newState = !isChecked;
        setIsChecked(newState);
        onSubmitPrivate();
    };

    const deleteUser = async (e) => {
        e.preventDefault();

        try {
            await axios.delete("/user/profile/delete", {
                data: { password },
            });

            return <Navigate to="/" />;
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
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

                    <div className="flex flex-col">
                        <label
                            htmlFor="bio"
                            className="block mb-1 ml-1 text-sm font-medium text-gray-800"
                        >
                            Tanıtım yazısı
                        </label>
                        <input
                            id="bio"
                            type="text"
                            placeholder="Tanıtım yazısı"
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-1 outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            {...register("bio", {
                                required: "Tanıtım yazısı zorunludur",
                                maxLength: {
                                    value: 50,
                                    message:
                                        "Tanıtım yazısı en fazla 50 karakter olabilir",
                                },
                            })}
                        />
                        {errors.bio && (
                            <span className="text-red-500 text-sm mt-1">
                                {errors.bio.message}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={handleToggle}
                                className="sr-only peer"
                            />
                            <div
                                className={`relative w-11 h-6 ${
                                    isChecked ? "bg-blue-600" : "bg-gray-200"
                                } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600`}
                            ></div>
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                Hesap Gizliliği
                            </span>
                        </label>
                    </div>
                    <div className="mt-4 border-t-2 pt-4">
                        <header>
                            <h2 className="text-lg font-medium text-gray-900">
                                Hesabı Sil
                            </h2>

                            <p className="mt-1 text-sm text-gray-600">
                                Hesabınız silindiğinde, tüm verileriniz ve
                                içerikleriniz kalıcı olarak silinecektir. Silme
                                işlemi öncesinde, saklamak istediğiniz verileri
                                indirmenizi öneririz.
                            </p>
                        </header>
                        <Button
                            type="button"
                            variant="roundedRed"
                            className="bg-red-600 text-white mt-4 p-2 rounded"
                            onClick={() => setDeleteModal(true)}
                        >
                            Hesapı Sil
                        </Button>
                    </div>
                </div>
                <div className="mt-6 bg-white py-3 px-6 flex gap-2 justify-end border-t rounded-b-xl">
                    <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Kaydet
                    </Button>
                </div>
            </form>
            <Modal
                isOpen={isDeleteModal}
                onClose={onCloseDelete}
                title="Hesapı Sil"
                maxWidth="xl"
            >
                <form onSubmit={(e) => deleteUser(e)} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Hesabınızı silmek istediğinizden emin misiniz?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Hesabınız silindiğinde, tüm verileriniz ve içerikleriniz
                        kalıcı olarak silinecektir. Lütfen işlemi onaylamak için
                        şifrenizi girin.
                    </p>

                    <div className="mt-6">
                        <input
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white border outline-none transition-all focus:ring-1 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Şifre"
                        />
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </div>

                    <div className="mt-6 flex gap-2.5 justify-end">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={onCloseDelete}
                        >
                            Vazgeç
                        </Button>

                        <Button variant="roundedRed" type="submit">
                            Hesapı sil
                        </Button>
                    </div>
                </form>
            </Modal>
        </Modal>
    );
};

export default EditProfile;
