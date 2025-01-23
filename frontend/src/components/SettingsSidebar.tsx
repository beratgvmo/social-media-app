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
import EditProfile from "./editProfile";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const SettingsSidebar: React.FC = () => {
    const { logout } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const navigate = useNavigate();

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenModalEdit = () => {
        setIsModalOpenEdit(true);
    };

    const handleCloseModalEdit = () => {
        setIsModalOpenEdit(false);
    };

    const handleLogout = async () => {
        try {
            await axios.post("/auth/logout");
            logout();
            navigate("/");
        } catch (error) {
            console.error("Çıkış işlemi başarısız", error);
        }
    };

    return (
        <>
            <PostModel isOpen={isModalOpen} onClose={handleCloseModal} />
            <EditProfile
                isOpen={isModalOpenEdit}
                onClose={handleCloseModalEdit}
            />
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
                        <button
                            onClick={handleOpenModalEdit}
                            className="flex items-center cursor-pointer font-semibold mt-2 hover:bg-blue-100 py-2 px-3 transition rounded-full"
                        >
                            <TbEdit className="text-xl mr-1.5" />
                            <p>Profile Düzenle</p>
                        </button>
                        <Link to={"/saved"}>
                            <div className="flex items-center cursor-pointer font-semibold mt-2 hover:bg-blue-100 py-2 px-3 transition rounded-full">
                                <TbBookmark className="text-xl mr-1.5" />
                                <p>Kayıt Edilenler</p>
                            </div>
                        </Link>
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
