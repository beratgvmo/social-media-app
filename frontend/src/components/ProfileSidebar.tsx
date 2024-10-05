import banner from "../pages/banner.jpg";
import { TbUser } from "react-icons/tb";
import { useAuthStore } from "../store/useAuthStore";

const ProfileSidebar: React.FC = () => {
    const { user } = useAuthStore();
    return (
        <div className="w-[230px]">
            <div className="bg-white rounded-lg border">
                <div className="">
                    <img src={banner} alt="" className="rounded-t-lg" />
                    <div className="relative">
                        <div className="absolute -bottom-9 w-16 h-16 bg-white rounded-full left-3 group">
                            {user?.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt="Profil Resmi"
                                    className="w-full h-full rounded-full border-2 bg-white border-white"
                                />
                            ) : (
                                <div className="p-2 flex text-blue-500 justify-center items-center w-full h-full bg-gray-200 rounded-full border-4 border-white">
                                    <TbUser size={90} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-4 mt-6">
                    <div className="flex items-center gap-4">
                        <p className="text-xl font-medium">{user?.name}</p>
                    </div>
                    <div className="text-xs mt-0.5">Berat Güven</div>
                </div>
            </div>
            <div className="bg-white rounded-lg border mt-1.5 p-4">
                <div className="flex justify-between text-xs font-semibold">
                    <p>Profil gösterimi</p>
                    <p className="text-blue-500">11</p>
                </div>
                <div className="flex justify-between text-xs font-semibold mt-2">
                    <p>Gönderi gösterimi</p>
                    <p className="text-blue-500">4</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;
