import { useAuthStore } from "../store/useAuthStore";
import { TbUser, TbUserHeart } from "react-icons/tb";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { HiOutlinePhoto } from "react-icons/hi2";

import ProfileSidebar from "../components/ProfileSidebar";
import RightbarFollow from "../components/RightbarFollow";

const Home: React.FC = () => {
    const { user } = useAuthStore();
    return (
        <div className="flex gap-5 mt-6">
            <ProfileSidebar />
            <div className="w-[570px]">
                <div className="p-4 bg-white rounded-lg border mb-3">
                    <div className="mb-5 flex gap-4">
                        <div className="">
                            {user?.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt="Profil Resmi"
                                    className="w-12 h-12 ml-1 rounded-full border bg-white"
                                />
                            ) : (
                                <TbUser className="w-10 h-10 p-2 flex items-center border rounded-full text-blue-500" />
                            )}
                        </div>
                        <input
                            className="w-full px-4 border rounded-3xl border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Mesajınızı yazın"
                            type="text"
                        />
                    </div>
                    <div className="flex items-center justify-around">
                        <div className="flex items-center">
                            <HiOutlinePhoto className="text-red-500 mr-1 w-5 h-5" />
                            <p className="font-medium text-red-500 text-sm">
                                Resim
                            </p>
                        </div>
                        <div className="flex items-center">
                            <MdOutlineEmojiEmotions className="text-orange-500 mr-1 w-5 h-5" />
                            <p className="font-medium text-orange-500 text-sm">
                                Emoji
                            </p>
                        </div>
                        <div className="flex items-center">
                            <TbUserHeart className="text-green-500 mr-1 w-5 h-5" />
                            <p className="font-medium text-green-500 text-sm">
                                Etiketle
                            </p>
                        </div>
                    </div>
                </div>
                <div className="border-b-2 border-gray-300"></div>
            </div>
            <RightbarFollow />
        </div>
    );
};

export default Home;
