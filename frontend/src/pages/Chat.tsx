import { useEffect, useRef, useState } from "react";
import axios from "@/utils/axiosInstance";
import { useAuthStore } from "@/store/useAuthStore";
import ChatMessage from "@/components/chatMessage";
import ChatSidebar from "@/components/chatSidebar";
import ChatWelcome from "@/components/chatWelcome";
import ChatHeader from "@/components/chatHeader";
import MessageInput from "@/components/messageInput";
import Modal from "@/components/Modal";
import FriendItem from "@/components/chatSidebar/friendItem";
import { io, Socket } from "socket.io-client";

let socket: Socket;

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
    bio: string;
}

const Chat: React.FC = () => {
    const [chatRooms, setChatRooms] = useState<RoomChat[]>([]);
    const [thisRoom, setThisRoom] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mutualFriends, setMutualFriends] = useState<User[]>([]);
    const { user } = useAuthStore();

    const inputRef = useRef<HTMLInputElement>(null);

    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    const fetchRooms = async () => {
        try {
            const response = await axios.get(`chat/userRooms/${user.id}`);
            setChatRooms(response.data);
        } catch (error) {
            console.error("Mesajları alırken hata oluştu:", error);
        }
    };

    const fetchMutualFriends = async () => {
        try {
            const response = await axios.get(`chat/new/friends`);
            setMutualFriends(response.data);
        } catch (error) {
            console.error("Arkadaşları alırken hata oluştu:", error);
        }
    };

    useEffect(() => {
        if (!socket) {
            socket = io("http://localhost:3000");
        }

        fetchRooms();

        socket.on("roomDeleted", (chatRoomId) => {
            setChatRooms((prevRooms) =>
                prevRooms.filter((room) => room.id !== chatRoomId)
            );
            setThisRoom(null);
        });

        socket.on("chatRoom", ({ data }) => {
            setChatRooms(data);
            setThisRoom(null);
        });

        socket.emit("getUserRooms", { userId: user.id });

        return () => {
            socket.off("roomDeleted");
            socket.off("chatRoom");
        };
    }, [user.id]);

    useEffect(() => {
        if (user?.id) {
            fetchMutualFriends();
        }
    }, [user?.id]);

    useEffect(() => {
        if (thisRoom) {
            socket.emit("joinRoom", thisRoom);
        }
    }, [thisRoom]);

    const handleInputClick = () => {
        inputRef.current?.focus();
    };

    return (
        <>
            <div className="flex w-full h-full">
                <div className="w-2/6 min-w-[300px] h-full bg-white">
                    <ChatSidebar
                        user={user}
                        chatRooms={chatRooms}
                        thisRoom={thisRoom}
                        setThisRoom={setThisRoom}
                        handleInputClick={handleInputClick}
                        inputRef={inputRef}
                        handleModalOpen={handleModalOpen}
                    />
                </div>

                <div className="flex flex-1 flex-col h-full w-4/6 bg-white">
                    {!thisRoom && <ChatWelcome />}
                    {thisRoom && (
                        <div className="flex flex-col h-full">
                            <div>
                                {chatRooms.map(
                                    (room) =>
                                        room.id === thisRoom && (
                                            <ChatHeader
                                                key={room.id}
                                                room={room}
                                                user={user}
                                            />
                                        )
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto mr-0.5">
                                <ChatMessage
                                    chatRoomId={thisRoom}
                                    userId={user.id}
                                />
                            </div>

                            <div>
                                <MessageInput
                                    chatRoomId={thisRoom}
                                    userId={user.id}
                                />
                            </div>
                        </div>
                    )}
                </div>
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
        </>
    );
};

export default Chat;
