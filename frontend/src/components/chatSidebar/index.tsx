import { FC, RefObject } from "react";
import { TbSearch, TbUser } from "react-icons/tb";

interface ChatSidebarProps {
    chatRooms: RoomChat[];
    thisRoom: number | null;
    setThisRoom: (roomId: number) => void;
    handleInputClick: () => void;
    inputRef: RefObject<HTMLInputElement>;
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

const ChatSidebar: FC<ChatSidebarProps> = ({
    chatRooms,
    thisRoom,
    setThisRoom,
    handleInputClick,
    inputRef,
    user,
}) => {
    return (
        <div className="min-w-[25%] w-[25%] max-w-[25%] h-full bg-white p-4 border-r">
            <p className="text-xl font-medium mb-4 mt-1 ml-2">Sohbetler</p>

            <div
                onClick={handleInputClick}
                className="w-full flex items-center border-2 mb-3 border-gray-300 rounded-md focus-within:border-blue-500 px-2 cursor-pointer"
            >
                <TbSearch className="text-gray-500 text-lg" />
                <input
                    ref={inputRef}
                    type="text"
                    className="w-full p-1.5 text-sm outline-none"
                    placeholder="Aratın veya yeni sohbet başlatın"
                />
            </div>

            {chatRooms.map((room) => (
                <div
                    key={room.id}
                    onClick={() => setThisRoom(room.id)}
                    className={`px-3 py-2 rounded-md mt-1 cursor-pointer transition ${
                        thisRoom === room.id
                            ? "bg-gray-200/60"
                            : "hover:bg-gray-200/40"
                    }`}
                >
                    {[room.user1, room.user2].map(
                        (chatUser) =>
                            user.id !== chatUser.id && (
                                <div className="flex gap-3" key={chatUser.id}>
                                    <div className="w-12 h-12">
                                        {chatUser.profileImage ? (
                                            <img
                                                src={chatUser.profileImage}
                                                alt="Profil Resmi"
                                                className="w-full h-full rounded-full bg-white"
                                            />
                                        ) : (
                                            <div className="p-2 flex text-gray-500 justify-center items-center w-full h-full bg-gray-300 rounded-full">
                                                <TbUser size={90} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col">
                                        <p className="font-medium text-sm text-gray-800">
                                            {chatUser.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            merhaba ben berat
                                        </p>
                                    </div>
                                </div>
                            )
                    )}
                </div>
            ))}
        </div>
    );
};

export default ChatSidebar;
