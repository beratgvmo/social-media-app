import { FC, RefObject, useEffect, useState } from "react";
import { TbLibraryPlus, TbSearch } from "react-icons/tb";
import Modal from "@/components/Modal";
import axios from "@/utils/axiosInstance";
import ChatUserItem from "./chatUserItem";
import FriendItem from "./friendItem";

interface ChatSidebarProps {
    chatRooms: RoomChat[];
    thisRoom: number | null;
    setThisRoom: (roomId: number) => void;
    handleInputClick: () => void;
    inputRef: RefObject<HTMLInputElement>;
    user: User;
    fetchRooms: () => void;
}

interface RoomChat {
    id: number;
    user1: User;
    user2: User;
    lastMessageDate?: string;
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
    fetchRooms,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mutualFriends, setMutualFriends] = useState<User[]>([]);
    const [openModalId, setOpenModalId] = useState<number | null>(null);

    const filteredChatRooms = chatRooms.filter((room) => {
        const chatUser = room.user1.id === user.id ? room.user2 : room.user1;
        return chatUser.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get(`chat/new/friends`);
                setMutualFriends(response.data);
            } catch (error) {
                console.error("Mesajları alırken hata oluştu:", error);
            }
        };

        fetchRooms();
    }, []);

    const formatMessageDate = (date: string) => {
        const messageDate = new Date(date);
        const now = new Date();

        const differenceInMs = now.getTime() - messageDate.getTime();
        const differenceInHours = Math.floor(differenceInMs / (1000 * 60 * 60));

        const isYesterday =
            new Date(now.getTime() - 86400000).toDateString() ===
            messageDate.toDateString();

        if (
            differenceInHours < 24 &&
            messageDate.toDateString() === now.toDateString()
        ) {
            return messageDate.toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
            });
        } else if (isYesterday) {
            return "Dün";
        } else {
            return messageDate.toLocaleDateString("tr-TR");
        }
    };

    return (
        <div className="w-full h-full bg-white py-4 px-1 border-r">
            <div className="flex mb-3 mt-1 ml-2 px-3 justify-between items-center">
                <p className="text-xl font-medium">Sohbetler</p>
                <div
                    className="hover:bg-blue-100 p-2 rounded-full transition cursor-pointer"
                    onClick={handleModalOpen}
                >
                    <TbLibraryPlus className="text-xl" />
                </div>
            </div>
            <div className="pl-3 pr-2">
                <div
                    onClick={handleInputClick}
                    className="w-full flex items-center px-2 border-2 mb-3 border-gray-300 rounded-md focus-within:border-blue-500 cursor-pointer"
                >
                    <TbSearch className="text-gray-500 text-lg" />
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-full p-1.5 text-sm outline-none"
                        placeholder="Aratın veya yeni sohbet başlatın"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex flex-col overflow-scroll scrollbar-transition h-[86%] pl-3 pr-1">
                {filteredChatRooms.length === 0 ? (
                    <p className="text-gray-500 text-center mt-4">
                        Sonuç bulunamadı
                    </p>
                ) : (
                    filteredChatRooms.map((room) => {
                        const chatUser =
                            room.user1.id === user.id ? room.user2 : room.user1;
                        return (
                            <ChatUserItem
                                key={room.id}
                                chatUser={chatUser}
                                lastMessageDate={room.lastMessageDate}
                                thisRoom={thisRoom}
                                roomId={room.id}
                                onClick={() => {
                                    setThisRoom(room.id);
                                    setOpenModalId(room.id);
                                }}
                                formatMessageDate={formatMessageDate}
                                openModalId={openModalId}
                                setOpenModalId={setOpenModalId}
                            />
                        );
                    })
                )}
            </div>
            <Modal
                maxWidth="md"
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title="Yeni Sohbet Başlat"
            >
                {mutualFriends.length > 0 ? (
                    <div className="p-4">
                        {mutualFriends.map((friend) => (
                            <FriendItem
                                handleModalClose={handleModalClose}
                                key={friend.id}
                                fetchRooms={fetchRooms}
                                friend={friend}
                                setThisRoom={setThisRoom}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-6 flex justify-center items-center">
                        <p className="text-sm text-gray-800">Arkadaşın yok</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ChatSidebar;
