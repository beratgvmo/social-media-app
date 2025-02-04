import { useEffect } from "react";
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
        </Modal>
    );
};

export default EditProfile;
