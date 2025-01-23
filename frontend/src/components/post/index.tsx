import { useEffect, useRef, useState } from "react";
import {
    TbBookmark,
    TbBookmarkFilled,
    TbDots,
    TbEdit,
    TbMessageCircle,
    TbShare3,
    TbTrash,
    TbUser,
} from "react-icons/tb";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "@/utils/axiosInstance";

import PostImageGrid from "@/components/PostImageGrid";
import TimeAgo from "@/components/TimeAgo";
import PostComment from "@/components/post/PostComment";

interface PostProps {
    id: number;
    content: string;
    likeCount: number;
    commetCount: number;
    images: PostImage[];
    createdAt: string;
    user: User;
    border: boolean;
}

interface User {
    slug: string;
    profileImage: string;
    name: string;
    bio: string;
}

interface PostImage {
    url: string;
}

const Post: React.FC<PostProps> = ({
    id,
    content,
    images,
    createdAt,
    user,
    border,
    likeCount,
    commetCount,
}) => {
    const [isLike, setIsLike] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [isComment, setIsComment] = useState(false);
    const [isBubble, setIsBubble] = useState(false);
    const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
    const bubbleRef = useRef<HTMLDivElement | null>(null);
    const [currentCommentCount, setCurrentCommentCount] = useState(commetCount);

    const incrementCommentCount = () => {
        setCurrentCommentCount((prevCount) => prevCount + 1);
    };

    const fetchLike = async () => {
        try {
            await axios.post(`/like/post/${id}`);
            setIsLike(true);
            setCurrentLikeCount(currentLikeCount + 1);
        } catch (error) {
            console.error("error", error);
        }
    };

    const fetchRemoveLike = async () => {
        try {
            await axios.delete(`/like/remove/post/${id}`);
            setIsLike(false);
            setCurrentLikeCount(currentLikeCount - 1);
        } catch (error) {
            console.error("error", error);
        }
    };

    const checkPostStatus = async () => {
        try {
            const response = await axios.get(`/like/status/post/${id}`);
            setIsLike(response.data.status);
            setCurrentLikeCount(response.data.count);
        } catch (error) {
            console.log(error);
        }
    };

    const savePost = async (postId: number) => {
        try {
            await axios.post(`/post-saved/${postId}`);
            setIsSave(!isSave);
        } catch (error) {
            console.error("Error saving post:", error);
        }
    };

    const checkSavePostStatus = async () => {
        try {
            const response = await axios.get(`/post-saved/status/${id}`);
            setIsSave(response.data.status);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        checkPostStatus();
        checkSavePostStatus();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                bubbleRef.current &&
                !bubbleRef.current.contains(event.target as Node)
            ) {
                setIsBubble(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            className={
                border
                    ? "pt-3 pb-3 bg-white rounded-lg border mb-3"
                    : "pt-3 pb-3 bg-white rounded-t-lg border-b"
            }
        >
            <div className="flex justify-between">
                <Link to={`/profile/${user.slug}`}>
                    <div className="flex gap-2.5 pl-4">
                        <div className="w-12 h-12 mt-1">
                            {user?.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt="Profil Resmi"
                                    className="w-full h-full rounded-full border"
                                />
                            ) : (
                                <div className="flex justify-center items-center w-full h-full bg-gray-200 rounded-full border-4 border-white">
                                    <TbUser />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <p className="font-medium -mb-0.5">{user?.name}</p>
                            <p className="text-xs text-gray-600">{user?.bio}</p>
                            <p className="text-xs text-gray-500">
                                <TimeAgo createdAt={createdAt} />
                            </p>
                        </div>
                    </div>
                </Link>
                <div className="pr-4 relative" ref={bubbleRef}>
                    <button
                        onClick={() => setIsBubble(!isBubble)}
                        className="hover:bg-gray-100 p-1.5 rounded-full transition"
                    >
                        <TbDots />
                    </button>
                    {isBubble && (
                        <div className="absolute z-10 right-4 top-6 bg-white py-1 w-36 rounded-lg border shadow">
                            <p className="text-gray-800 text-sm font-medium flex items-center px-3 py-2 hover:bg-gray-100">
                                <TbEdit className="mr-1" size={18} />
                                Düzenle
                            </p>
                            <p className="text-gray-800 text-sm font-medium flex items-center px-3 py-2 hover:bg-gray-100">
                                <TbTrash className="mr-1" size={18} />
                                Kaldır
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-2.5 px-4">
                <p className="text-base">{content}</p>
            </div>
            <div className="px-4 mt-2">
                <PostImageGrid postImages={images.map((image) => image.url)} />
            </div>
            <div className="px-4 flex justify-between mt-2">
                <div className="flex gap-5">
                    {isLike ? (
                        <button
                            onClick={fetchRemoveLike}
                            className="flex items-center group"
                        >
                            <div className="w-8 h-8 p-1.5 rounded-full group-hover:bg-blue-100 transition mr-0.5">
                                <AiFillLike className="w-full h-full text-blue-500 group-hover:text-blue-500 transition cursor-pointer" />
                            </div>
                            <p className="text-blue-500 text-sm font-medium transition">
                                {currentLikeCount}
                            </p>
                        </button>
                    ) : (
                        <button
                            onClick={fetchLike}
                            className="flex items-center group"
                        >
                            <div className="w-8 h-8 p-1.5 rounded-full group-hover:bg-blue-100 transition mr-0.5">
                                <AiOutlineLike className="w-full h-full text-gray-700 group-hover:text-blue-500 transition cursor-pointer" />
                            </div>
                            <p className="text-gray-700 group-hover:text-blue-500 text-sm font-medium transition">
                                {currentLikeCount}
                            </p>
                        </button>
                    )}
                    <button
                        className="flex items-center group"
                        onClick={() => setIsComment(!isComment)}
                    >
                        <div className="w-8 h-8 p-1.5 rounded-full group-hover:bg-red-100 transition mr-0.5">
                            <TbMessageCircle className="w-full h-full text-gray-700 group-hover:text-red-500 transition cursor-pointer" />
                        </div>
                        <p className="text-gray-700 group-hover:text-red-500 text-sm font-medium transition">
                            {currentCommentCount}
                        </p>
                    </button>
                    <button className="w-8 h-8 p-1.5 rounded-full group hover:bg-green-100 transition">
                        <TbShare3 className="w-full h-full text-gray-700 group-hover:text-green-600 transition cursor-pointer" />
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => savePost(id)}
                        className="w-8 h-8 p-1.5 rounded-full hover:bg-gray-200 transition"
                    >
                        {isSave ? (
                            <TbBookmarkFilled className="w-full h-full text-gray-700 transition cursor-pointer" />
                        ) : (
                            <TbBookmark className="w-full h-full text-gray-700 transition cursor-pointer" />
                        )}
                    </button>
                </div>
            </div>
            <PostComment
                id={id}
                isComment={isComment}
                toggleComment={() => setIsComment(!isComment)}
                onAddComment={incrementCommentCount}
            />
        </div>
    );
};

export default Post;
