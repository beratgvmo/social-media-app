import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { TbBookmark, TbMessageCircle, TbShare3, TbUser } from "react-icons/tb";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";

interface PostProps {
    text: string;
    likeCount: string;
}

const Post: React.FC<PostProps> = () => {
    const [like, setLike] = useState(false);
    const { user } = useAuthStore();
    return (
        <div className="p-4 bg-white rounded-lg border mt-3">
            <div className="flex gap-2.5">
                <div className="w-12 h-12">
                    {user?.profileImage ? (
                        <img
                            src={user.profileImage}
                            alt="Profil Resmi"
                            className="w-full h-full rounded-full border"
                        />
                    ) : (
                        <div className="flex justify-center items-center w-full h-full bg-gray-200 rounded-full border-4 border-white">
                            <TbUser size={90} />
                        </div>
                    )}
                </div>
                <div>
                    <p className="font-medium ">{user?.name} Güven </p>
                    <p className="text-xs text-gray-600">3 gün</p>
                </div>
            </div>
            <div className="mt-2.5">
                <p className="text-sm">
                    Sizlerle kendi geliştirdiğim etkileşimli bir Quiz
                    Uygulaması'nı paylaşmaktan mutluluk duyarım. React ve
                    Next.js ile hayata geçirdiğim bu uygulama, kullanıcıların
                    eğlenirken öğrenebileceği interaktif quizler sunuyor.
                </p>
            </div>
            <div className="flex justify-between text-sm mt-2 mb-1.5 text-gray-500">
                <p>160 Beğeni</p>
                <p>9 yorum</p>
            </div>
            <div className="border-t px-2 pt-2 flex justify-between">
                <div className="flex gap-5">
                    <button onClick={() => setLike(!like)}>
                        {like ? (
                            <AiOutlineLike className="w-6 h-6 text-gray-700 hover:text-blue-500 hover:scale-125 transition hover:-translate-y-1 cursor-pointer" />
                        ) : (
                            <AiFillLike className="w-6 h-6 text-blue-500 hover:scale-125 transition hover:-translate-y-1 cursor-pointer" />
                        )}
                    </button>
                    <button>
                        <TbMessageCircle className="w-6 h-6 text-gray-700 hover:text-red-500 hover:scale-125 transition hover:-translate-y-1 cursor-pointer" />
                    </button>
                    <button>
                        <TbShare3 className="w-6 h-6 text-gray-700 hover:text-green-500 hover:scale-125 transition hover:-translate-y-1 cursor-pointer" />
                    </button>
                </div>
                <div>
                    <TbBookmark className="w-6 h-6 text-gray-700 hover:text-gray-700 hover:scale-125 transition hover:-translate-y-1 cursor-pointer" />
                    {/* <TbBookmarkFilled /> */}
                </div>
            </div>
        </div>
    );
};

export default Post;
