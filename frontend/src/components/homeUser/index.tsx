import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import usePostStore from "@/store/usePostStore";
import { TbUser, TbUserHeart } from "react-icons/tb";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { HiOutlinePhoto } from "react-icons/hi2";
import ProfileSidebar from "@/components/ProfileSidebar";
import RightbarFollow from "@/components/RightbarFollow";
import Post from "@/components/post";
import { CgSpinner } from "react-icons/cg";
import PostModel from "@/components/PostModel";

const HomeUser: React.FC = () => {
    const { user } = useAuthStore();
    const {
        homePosts,
        fetchPosts,
        pageInc,
        scrollPosition,
        setScrollPosition,
        hasMore,
        loading,
        page,
    } = usePostStore();

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, scrollPosition);
    }, [scrollPosition]);

    useEffect(() => {
        fetchPosts();
    }, [page]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;

            if (
                scrollTop + clientHeight >= scrollHeight - 100 &&
                hasMore &&
                !loading
            ) {
                pageInc();
            }

            setScrollPosition(scrollTop);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, loading]);

    return (
        <>
            <PostModel
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <div className="flex gap-5">
                <ProfileSidebar />
                <div className="min-w-[570px]">
                    <div className="pt-4 px-4 pb-3 bg-white rounded-lg border mb-3">
                        <div className="mb-2.5 flex gap-3">
                            <div className="w-14">
                                {user?.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt="Profil Resmi"
                                        className="w-12 h-12 ml-1 rounded-full border bg-white"
                                    />
                                ) : (
                                    <TbUser className="w-12 h-12 p-2 flex items-center border rounded-full text-blue-500" />
                                )}
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full text-start transition px-4 border rounded-3xl border-gray-400 text-sm text-gray-600 font-medium focus:outline-none hover:bg-gray-200"
                            >
                                Gönderi Yazın
                            </button>
                        </div>
                        <div className="flex items-center justify-around">
                            <div className="flex items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                                <HiOutlinePhoto className="text-red-500 mr-1 w-5 h-5" />
                                <p className="font-medium text-red-500 text-sm">
                                    Resim
                                </p>
                            </div>
                            <div className="flex items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                                <MdOutlineEmojiEmotions className="text-orange-500 mr-1 w-5 h-5" />
                                <p className="font-medium text-orange-500 text-sm">
                                    Emoji
                                </p>
                            </div>
                            <div className="flex items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                                <TbUserHeart className="text-green-500 mr-1 w-5 h-5" />
                                <p className="font-medium text-green-500 text-sm">
                                    Etiketle
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="border-b-2 border-gray-300"></div>
                    <div className="mb-4 mt-3">
                        {homePosts.map((post) => (
                            <Post
                                content={post.content}
                                likeCount={post.likeCount}
                                createdAt={post.createdAt}
                                images={post.postImages}
                                commetCount={post.commetCount}
                                key={post.id}
                                user={post.user}
                                id={post.id}
                                border={true}
                            />
                        ))}
                    </div>
                    {loading && (
                        <div className="w-full flex justify-center items-center h-20">
                            <CgSpinner
                                className="animate-spin text-blue-600"
                                size={45}
                            />
                        </div>
                    )}
                </div>
                <RightbarFollow />
            </div>
        </>
    );
};

export default HomeUser;