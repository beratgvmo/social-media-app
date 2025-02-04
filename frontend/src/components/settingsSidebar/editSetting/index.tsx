import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/Modal";
import axios from "@/utils/axiosInstance";
import { useAuthStore } from "@/store/useAuthStore";

interface EditSettingProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditSetting: React.FC<EditSettingProps> = ({ isOpen, onClose }) => {
    const { user } = useAuthStore();

    const [isChecked, setIsChecked] = useState(user.isPrivate);

    const onSubmit = async (newState: boolean) => {
        try {
            await axios.patch("/user/update-profile/private");
        } catch (error) {
            console.error("Profil güncellemesi başarısız:", error);
        }
    };

    const handleToggle = () => {
        const newState = !isChecked;
        setIsChecked(newState);
        onSubmit(newState);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Profil Düzenle"
            maxWidth="2xl"
        >
            <div className="pt-5 px-6 gap-5 flex flex-col pb-6">
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
            </div>
        </Modal>
    );
};

export default EditSetting;
