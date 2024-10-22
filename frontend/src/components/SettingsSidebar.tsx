import { useState } from "react";
import {
    TbBookmark,
    TbEdit,
    TbLogout,
    TbSettings,
    TbSquareRoundedPlus,
} from "react-icons/tb";
import PostModel from "./PostModel";
import axios from "../utils/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";

const SettingsSidebar: React.FC = () => {
    const { logout } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleLogout = async () => {
        try {
            await axios.post("/auth/logout");
            logout();
        } catch (error) {
            console.error("Çıkış işlemi başarısız", error);
        }
    };

    return (
        <>
            <PostModel isOpen={isModalOpen} onClose={handleCloseModal} />
            <div className="min-w-[230px]">
                <div className="bg-white rounded-lg border px-4 py-3">
                    <div className="inline-block">
                        <button
                            onClick={handleOpenModal}
                            className="flex items-center cursor-pointer font-semibold hover:bg-blue-100 py-2 px-3 transition rounded-full"
                        >
                            <TbSquareRoundedPlus className="text-xl mr-1.5" />
                            <p>Gönderi Olustur</p>
                        </button>
                        <div className="flex items-center cursor-pointer font-semibold mt-2 hover:bg-blue-100 py-2 px-3 transition rounded-full">
                            <TbEdit className="text-xl mr-1.5" />
                            <p>Profile Düzenle</p>
                        </div>
                        <div className="flex items-center cursor-pointer font-semibold mt-2 hover:bg-blue-100 py-2 px-3 transition rounded-full">
                            <TbBookmark className="text-xl mr-1.5" />
                            <p>Kayıt Edilenler</p>
                        </div>
                        <div className="flex items-center mt-2 cursor-pointer font-semibold hover:bg-blue-100 py-2 px-3 transition rounded-full">
                            <TbSettings className="text-xl mr-1.5" />
                            <p>Ayarlar</p>
                        </div>
                        <button
                            onClick={() => handleLogout()}
                            className="flex items-center cursor-pointer font-semibold mt-2 hover:bg-blue-100 py-2 px-3 transition rounded-full"
                        >
                            <TbLogout className="text-xl mr-1.5" />
                            <p>Oturumu Kapat</p>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsSidebar;
