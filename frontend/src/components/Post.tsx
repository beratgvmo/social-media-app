import { useEffect, useRef, useState } from "react";
import {
    TbBookmark,
    TbDots,
    TbEdit,
    TbMessageCircle,
    TbShare3,
    TbTrash,
    TbUser,
} from "react-icons/tb";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import PostImageGrid from "./PostImageGrid";
import TimeAgo from "./TimeAgo";
import { Link } from "react-router-dom";
import axios from "../utils/axiosInstance";

import PostComments from "./PostComments";

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
    id: number;
    slug: string;
    profileImage: string;
    name: string;
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
    const [isComment, setIsComment] = useState(false);
    const [isBubble, setIsBubble] = useState(false);
    const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
    const bubbleRef = useRef<HTMLDivElement | null>(null);

    const fetchLike = async () => {
        try {
            await axios.post("like/post/" + id);
            setIsLike(true);
            setCurrentLikeCount((prevCount) => prevCount + 1);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchRemoveLike = async () => {
        try {
            await axios.delete("like/remove/post/" + id);
            setIsLike(false);
            setCurrentLikeCount((prevCount) => prevCount - 1);
        } catch (error) {
            console.error(error);
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

    useEffect(() => {
        checkPostStatus();
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
                    ? "pt-4 pb-3 bg-white rounded-lg border mt-3"
                    : "pt-4 pb-3 bg-white rounded-t-lg border-b"
            }
        >
            <div className="flex justify-between">
                <Link to={`/profile/${user.slug}`}>
                    <div className="flex gap-2.5 pl-4">
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
                        <div className="flex justify-between">
                            <div>
                                <p className="font-medium">{user?.name}</p>
                                <p className="text-xs text-gray-600">
                                    <TimeAgo createdAt={createdAt} />
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
                <div className="pr-6 relative" ref={bubbleRef}>
                    <button
                        onClick={() => setIsBubble(!isBubble)}
                        className="hover:bg-gray-100 p-1 rounded-full transition"
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
                            {commetCount}
                        </p>
                    </button>
                    <button className="w-8 h-8 p-1.5 rounded-full group hover:bg-green-100 transition mr-0.5">
                        <TbShare3 className="w-full h-full text-gray-700 group-hover:text-green-600 transition cursor-pointer" />
                    </button>
                </div>
                <div>
                    <button className="w-8 h-8 p-1.5 rounded-full hover:bg-gray-200 transition mr-0.5">
                        <TbBookmark className="w-full h-full text-gray-700 transition cursor-pointer" />
                    </button>
                </div>
            </div>
            <PostComments
                id={id}
                isComment={isComment}
                toggleComment={() => setIsComment(!isComment)}
            />
        </div>
    );
};

export default Post;
