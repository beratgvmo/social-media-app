import React, { ChangeEvent, useEffect, useState } from "react";
import { TbSend2, TbUser } from "react-icons/tb";
import axios from "../utils/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";
import CommentItem from "./CommentItem";

interface PostCommentsProps {
    id: number;
    isComment: boolean;
    toggleComment: () => void;
}

interface User {
    id: number;
    slug: string;
    profileImage: string;
    name: string;
}

interface CommentType {
    id: number;
    content: string;
    user: User;
    replies?: CommentType[];
}

const PostComments: React.FC<PostCommentsProps> = ({ isComment, id }) => {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [content, setContent] = useState<string>("");
    const { user } = useAuthStore();

    const fetchComments = async () => {
        try {
            const response = await axios.get(`/comment/post/${id}`);
            setComments(response.data);
        } catch (error) {
            console.error("Yorumlar çekilirken hata oluştu:", error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        target.style.height = "40px";

        if (target.scrollHeight > 40) {
            target.style.height = `${target.scrollHeight}px`;
        }

        setContent(target.value);
    };

    const handleAddComment = async () => {
        try {
            await axios.post("/comment/add", {
                content,
                postId: id,
                userId: user?.id,
                parentCommentId: null,
            });
            setContent("");
            fetchComments();
        } catch (error) {
            console.error("Yorum eklenirken hata oluştu:", error);
        }
    };

    return (
        <div>
            {isComment && (
                <div className="bg-white border-t mt-2 px-4 pt-3">
                    <div className="mb-2.5 flex gap-3">
                        {user?.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt="Profil Resmi"
                                className="w-10 h-10 rounded-full border bg-white"
                            />
                        ) : (
                            <TbUser className="w-12 h-12 p-2 flex items-center border rounded-full text-blue-500" />
                        )}

                        <textarea
                            value={content}
                            onChange={handleInput}
                            placeholder="Yorum yaz"
                            className="w-full text-start transition px-4 p-2 h-[40px] border rounded-[20px] border-gray-400 focus:border-gray-600 focus:outline-2 outline-gray-600 text-sm text-gray-700 font-medium resize-none overflow-hidden"
                            rows={1}
                        />
                        <div>
                            <button
                                onClick={handleAddComment}
                                className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 transition"
                            >
                                <TbSend2 className="text-white" size={19} />
                            </button>
                        </div>
                    </div>
                    {comments.length > 0 && (
                        <div className="mt-4">
                            <p className="text-gray-500 text-sm font-medium mb-2">
                                Yorumlar - - -
                            </p>

                            {comments.map((comment) => (
                                <CommentItem
                                    key={comment.id}
                                    postId={id}
                                    comment={comment}
                                    fetchComments={() => fetchComments()}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostComments;
