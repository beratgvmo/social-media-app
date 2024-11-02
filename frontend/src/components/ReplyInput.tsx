import React, { ChangeEvent, useState } from "react";
import { TbSend2, TbUser } from "react-icons/tb";
import axios from "../utils/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";

interface ReplyInputProps {
    postId: number;
    commentId: number;
}

const ReplyInput: React.FC<ReplyInputProps> = ({ postId, commentId }) => {
    const [content, setContent] = useState<string>("");
    const { user } = useAuthStore();

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
                postId: postId,
                userId: user?.id,
                parentCommentId: commentId,
            });
            setContent("");
        } catch (error) {
            console.error("Yorum eklenirken hata oluştu:", error);
        }
    };

    return (
        <div className="mb-6 flex gap-3 ml-10 mt-4">
            {user?.profileImage ? (
                <img
                    src={user?.profileImage}
                    alt="Profil Resmi"
                    className="w-10 h-10 rounded-full border bg-white"
                />
            ) : (
                <div>
                    <TbUser className="w-10 h-10 p-2 flex items-center border rounded-full text-blue-500" />
                </div>
            )}

            <textarea
                value={content}
                onChange={handleInput}
                placeholder="Yanıt ekle..."
                className="w-full text-start transition px-4 p-2 h-[40px] border rounded-[20px] border-gray-400 bg-gray-100 focus:border-gray-600 focus:outline-2 outline-gray-600 text-sm text-gray-700 font-medium resize-none overflow-hidden"
                rows={1}
            />

            <div className="w-10">
                <button
                    onClick={handleAddComment}
                    className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 transition"
                >
                    <TbSend2 className="text-white" size={19} />
                </button>
            </div>
        </div>
    );
};

export default ReplyInput;
