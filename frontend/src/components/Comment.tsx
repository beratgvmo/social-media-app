import { AiFillLike } from "react-icons/ai";
import { TbUser } from "react-icons/tb";

interface User {
    slug: string;
    profileImage: string;
    name: string;
}
interface CommentProps {
    id: number;
    content: string;
    user: User;
    border: boolean;
    toggleReplies: () => void;
}

const Comment: React.FC<CommentProps> = ({
    content,
    user,
    border,
    toggleReplies,
}) => (
    <div className="flex gap-2">
        <div className="min-w-10">
            {user?.profileImage ? (
                <img
                    src={user.profileImage}
                    alt="Profil Resmi"
                    className="w-10 h-10 rounded-full border bg-white"
                />
            ) : (
                <TbUser className="w-10 h-10 p-2 flex items-center border rounded-full text-blue-500" />
            )}
            {border && (
                <div className="flex items-center justify-center h-[55%]">
                    <div className="bg-gray-200 h-full border-l-2"></div>
                </div>
            )}
        </div>

        <div>
            <div className="bg-gray-100 px-3 pb-3 pt-2 rounded-xl">
                <p className="text-sm font-medium pb-0.5">{user.name}</p>
                <div className="text-sm">{content}</div>
            </div>
            <div className="flex items-center">
                <div className="ml-2 mt-1 flex items-center">
                    <p className="mr-1.5 text-xs text-gray-600 font-medium hover:text-blue-600 cursor-pointer">
                        Beğen
                    </p>
                    <div className="flex items-center border p-0.5 rounded-full">
                        <div className="bg-blue-600 flex items-center justify-center p-0.5 rounded-full">
                            <AiFillLike className="text-blue-100 w-3 h-3" />
                        </div>
                        <p className="text-gray-600 text-xs pl-1 pr-1">100</p>
                    </div>
                </div>
                <p className="text-gray-600 text-xs px-2">|</p>
                <div className="mt-1 flex items-center">
                    <button
                        onClick={toggleReplies}
                        className="mr-1.5 text-xs text-gray-600 font-medium"
                    >
                        Yanıtla
                    </button>
                    <p className="text-gray-600 text-xs pl-1 pr-1">100</p>
                </div>
            </div>
        </div>
    </div>
);

export default Comment;
