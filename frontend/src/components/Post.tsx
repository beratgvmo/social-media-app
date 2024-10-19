import { useEffect, useState } from "react";
import { TbBookmark, TbMessageCircle, TbShare3, TbUser } from "react-icons/tb";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import PostImageGrid from "./PostImageGrid";
import TimeAgo from "./TimeAgo";
import { Link } from "react-router-dom";
import axios from "../utils/axiosInstance";

interface PostProps {
    id: number;
    content: string;
    likeCount: string;
    images: PostImage[];
    createdAt: string;
    user: User;
    border: boolean;
}

export interface User {
    slug: string;
    profileImage: string;
    name: string;
}

export interface PostImage {
    url: string;
}

const Post: React.FC<PostProps> = ({
    id,
    content,
    images,
    createdAt,
    user,
    border,
}) => {
    const [isLike, setIsLike] = useState(false);
    const [LikeCount, setLikeCount] = useState(false);

    const fetchLike = async () => {
        try {
            const response = await axios.post("like/post/" + id);
            setIsLike(true);
            setLikeCount(response.data); // Update like count with response
        } catch (error) {
            console.error(error);
        }
    };

    const fetchRemoveLike = async () => {
        try {
            const response = await axios.delete("like/remove/post/" + id);
            setIsLike(false);
            setLikeCount(response.data); // Update like count with response
        } catch (error) {
            console.error(error);
        }
    };

    const checkPostStatus = async () => {
        try {
            const response = await axios.get(`/like/status/post/${id}`);
            setIsLike(response.data);
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        checkPostStatus();
    }, []);

    return (
        <div
            className={
                border
                    ? "pt-4 pb-3 bg-white rounded-lg border mt-3"
                    : "pt-4 pb-3 bg-white rounded-t-lg border-b"
            }
        >
            <Link to={`/profile/${user.slug}`}>
                <div className="flex gap-2.5 px-4">
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
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-600">
                            <TimeAgo createdAt={createdAt} />
                        </p>
                    </div>
                </div>
            </Link>
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
                                1
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
                                0
                            </p>
                        </button>
                    )}
                    <button className="flex items-center group">
                        <div className="w-8 h-8 p-1.5 rounded-full group-hover:bg-red-100 transition mr-0.5">
                            <TbMessageCircle className="w-full h-full text-gray-700 group-hover:text-red-500 transition cursor-pointer" />
                        </div>
                        <p className="text-gray-700 group-hover:text-red-500 text-sm font-medium transition">
                            12
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
        </div>
    );
};

export default Post;
