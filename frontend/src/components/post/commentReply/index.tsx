import { AiFillLike } from "react-icons/ai";
import { TbUser } from "react-icons/tb";

interface User {
    slug: string;
    profileImage: string;
    name: string;
}
interface CommentReplyProps {
    id: number;
    content: string;
    user: User;
}

const CommentReply: React.FC<CommentReplyProps> = ({ content, user }) => (
    <div className="flex mt-3">
        <div className="relative mt-5">
            <div className="bg-gray-200 absolute -left-5 w-5 border-b-2"></div>
        </div>
        <div className="min-w-10 mr-2">
            {user?.profileImage ? (
                <img
                    src={user.profileImage}
                    alt="Profil Resmi"
                    className="w-10 h-10 rounded-full border bg-white"
                />
            ) : (
                <TbUser className="w-10 h-10 p-2 flex items-center border rounded-full text-blue-500" />
            )}
        </div>

        <div>
            <div className="bg-gray-100 px-3 pb-3 pt-2 rounded-xl">
                <p className="text-sm font-medium pb-0.5">{user.name}</p>
                <div className="text-sm">{content}</div>
            </div>
            <div className="flex items-center">
                <div className="ml-2 mt-1 flex items-center">
                    <p className="mr-1.5 text-xs hover:text-blue-600 cursor-pointer text-gray-600 font-medium">
                        Beğen
                    </p>
                    <div className="flex items-center border p-0.5 rounded-full">
                        <div className="bg-blue-600 flex items-center justify-center p-0.5 rounded-full">
                            <AiFillLike className="text-blue-100 w-3 h-3" />
                        </div>
                        <p className="text-gray-600 text-xs pl-1 pr-1">100</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default CommentReply;
