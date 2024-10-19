import { useEffect, useState } from "react";

import { useAuthStore } from "../store/useAuthStore";
import { TbUser, TbUserHeart } from "react-icons/tb";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { HiOutlinePhoto } from "react-icons/hi2";
import axios from "../utils/axiosInstance";

import ProfileSidebar from "../components/ProfileSidebar";
import RightbarFollow from "../components/RightbarFollow";
import Post from "../components/Post";
import { CgSpinner } from "react-icons/cg";
import PostModel from "../components/PostModel";

export interface Post {
    id: number;
    content: string;
    createdAt: string;
    postImages: PostImage[];
    user: User;
}

export interface PostImage {
    id: number;
    url: string;
}

export interface User {
    slug: string;
    profileImage: string;
    name: string;
}

const Home: React.FC = () => {
    const { user } = useAuthStore();
    const [posts, setPosts] = useState<Post[]>([]);
    const limit = 1;
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 100));
            try {
                const response = await axios.get(`/post`, {
                    params: { page, limit },
                });
                const newPosts: Post[] = response.data;

                if (newPosts.length < limit) {
                    setHasMore(false);
                }

                setPosts((prevPosts) => [...prevPosts, ...newPosts]);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        if (hasMore) {
            fetchPosts();
        }
    }, [page]);

    const handleScroll = () => {
        const scrollTop =
            document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight =
            document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight =
            document.documentElement.clientHeight || window.innerHeight;

        if (
            scrollTop + clientHeight >= scrollHeight - 5 &&
            hasMore &&
            !loading
        ) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, hasMore]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <PostModel isOpen={isModalOpen} onClose={handleCloseModal} />
            <div className="flex gap-5 mt-6">
                <ProfileSidebar />
                <div className="w-[570px]">
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
                                    <TbUser className="w-10 h-10 p-2 flex items-center border rounded-full text-blue-500" />
                                )}
                            </div>
                            <button
                                onClick={handleOpenModal}
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
                    <div className="mb-4">
                        {posts.map((post, index) => (
                            <Post
                                content={post.content}
                                likeCount="0"
                                createdAt={post.createdAt}
                                images={post.postImages}
                                key={index}
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

export default Home;
