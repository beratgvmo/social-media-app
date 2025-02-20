import { ChangeEvent, useState, useCallback } from "react";
import Comment from "@/components/post/comment";
import CommentReply from "@/components/post/commentReply";
import { TbChevronDown, TbChevronUp, TbSend2, TbUser } from "react-icons/tb";
import axios from "@/utils/axiosInstance";
import { useAuthStore } from "@/store/useAuthStore";

interface CommentItemProps {
    comment: CommentType;
    postId: number;
    fetchComments: () => void;
    handleDeleteComment: (id: number) => void;
}

interface CommentType {
    id: number;
    content: string;
    user: User;
    replies?: CommentType[];
}

interface User {
    id: number;
    slug: string;
    profileImage: string;
    name: string;
}

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    postId,
    fetchComments,
    handleDeleteComment,
}) => {
    const [repliesInputOpen, setRepliesInputOpen] = useState<boolean>(false);
    const [repliesOpen, setRepliesOpen] = useState<boolean>(false);
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

    const handleAddComment = useCallback(async () => {
        try {
            await axios.post("/comment/add", {
                content,
                postId: postId,
                userId: user?.id,
                parentCommentId: comment.id,
            });
            setContent("");
            setRepliesInputOpen(false);
            fetchComments();
        } catch (error) {
            console.error("Yorum eklenirken hata oluştu:", error);
        }
    }, [content, postId, user?.id, comment.id, fetchComments]);

    return (
        <div className="mt-6">
            <Comment
                content={comment.content}
                id={comment.id}
                commentUser={comment.user}
                toggleReplies={() => setRepliesInputOpen(!repliesInputOpen)}
                border={!!comment.replies?.length}
                commentReplyCount={comment.replies?.length || 0}
                handleDeleteComment={handleDeleteComment} // Burada handleDeleteComment fonksiyonunu ilettik
            />
            {comment.replies && comment.replies.length > 0 && (
                <div className="flex h-10">
                    <div className="flex w-10 items-center justify-center">
                        <div className="bg-gray-200 h-full border-l-2"></div>
                    </div>
                    <div>
                        <button
                            onClick={() => setRepliesOpen(!repliesOpen)}
                            className="flex items-end ml-2 mt-3 hover:bg-blue-200 py-1.5 pl-3 pr-3.5 rounded-full"
                        >
                            {repliesOpen ? (
                                <TbChevronUp className="text-blue-600" />
                            ) : (
                                <TbChevronDown className="text-blue-600" />
                            )}
                            <p className="text-sm text-blue-600 ml-0.5 font-medium">
                                {comment.replies.length} yanıt
                            </p>
                        </button>
                    </div>
                </div>
            )}
            {comment.replies && comment.replies.length > 0 && repliesOpen && (
                <div className="flex">
                    <div className="flex min-w-10 items-center justify-center min-h-full">
                        <div className="bg-gray-200 h-full border-l-2"></div>
                    </div>
                    <div>
                        {comment.replies.map((reply) => (
                            <CommentReply
                                key={reply.id}
                                content={reply.content}
                                id={reply.id}
                                commentUser={reply.user}
                                handleDeleteComment={handleDeleteComment} // Burada handleDeleteComment fonksiyonunu ilettik
                            />
                        ))}
                    </div>
                </div>
            )}
            {repliesInputOpen && (
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
            )}
        </div>
    );
};

export default CommentItem;
