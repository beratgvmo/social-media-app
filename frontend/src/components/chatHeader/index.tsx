import { FC } from "react";
import { TbUser } from "react-icons/tb";

interface ChatHeaderProps {
    room: RoomChat | null;
    user: User;
}

interface RoomChat {
    id: number;
    user1: User;
    user2: User;
}

interface User {
    id: number;
    name: string;
    profileImage: string;
    slug: string;
}

const ChatHeader: FC<ChatHeaderProps> = ({ room, user }) => {
    const chatUser = room
        ? room.user1.id === user.id
            ? room.user2
            : room.user1
        : null;

    return (
        <div className="min-h-16 bg-white pl-4 flex items-center border-b">
            {chatUser ? (
                <div className="flex gap-2 items-center">
                    <div className="w-10 h-10">
                        {chatUser.profileImage ? (
                            <img
                                src={chatUser.profileImage}
                                alt="Profil Resmi"
                                className="w-full h-full rounded-full bg-white"
                            />
                        ) : (
                            <div className="p-2 flex text-gray-600 justify-center items-center w-full h-full bg-gray-300 rounded-full">
                                <TbUser size={20} />
                            </div>
                        )}
                    </div>
                    <p className="font-medium text-sm text-gray-800">
                        {chatUser.name}
                    </p>
                </div>
            ) : (
                <p className="text-gray-500">Kullanıcı bilgisi bulunamadı</p>
            )}
        </div>
    );
};

export default ChatHeader;
