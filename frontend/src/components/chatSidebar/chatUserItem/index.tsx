import { useAuthStore } from "@/store/useAuthStore";
import { FC, useRef, useEffect, useState } from "react";
import { TbUser, TbChevronDown } from "react-icons/tb";
import { io, Socket } from "socket.io-client";

let socket: Socket;

interface ChatUserItemProps {
    chatUser: {
        id: number;
        name: string;
        profileImage: string;
        bio: string;
    };
    lastMessageDate: string | undefined;
    thisRoom: number | null;
    roomId: number;
    onClick: () => void;
    formatMessageDate: (date: string) => string;
    openModalId: number | null;
    setOpenModalId: (id: number | null) => void;
}

interface Message {
    id: number;
    content: string;
    createdAt: string;
    sender: User;
}

interface User {
    id: number;
    name: string;
    profileImage: string;
}

const ChatUserItem: FC<ChatUserItemProps> = ({
    chatUser,
    lastMessageDate,
    thisRoom,
    roomId,
    onClick,
    formatMessageDate,
    openModalId,
    setOpenModalId,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const { user } = useAuthStore();

    const toggleModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenModalId(openModalId === roomId ? null : roomId);
    };

    const closeModal = (e: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            setOpenModalId(null);
        }
    };

    useEffect(() => {
        if (!socket) {
            socket = io("http://localhost:3000");
        }

        socket.emit("joinRoom", roomId);

        return () => {
            socket.off("roomDeleted");
            socket.off("chatRoom");
            socket.emit("leaveRoom");
        };
    }, [user.id]);

    const handleDeleteRoom = (chatRoomId: number) => {
        socket.emit("sendDeleteRoom", { chatRoomId, userId: user.id });
    };

    useEffect(() => {
        if (openModalId === roomId) {
            document.addEventListener("click", closeModal);
        } else {
            document.removeEventListener("click", closeModal);
        }

        return () => document.removeEventListener("click", closeModal);
    }, [openModalId]);

    return (
        <div
            onClick={onClick}
            className={`relative px-3 py-2 group rounded-md mt-1 cursor-pointer transition ${
                thisRoom === roomId
                    ? "bg-gray-200/55 hover:bg-gray-200/75"
                    : "hover:bg-gray-200/30"
            }`}
        >
            <div className="flex justify-between items-center">
                <div className="flex gap-3">
                    <div className="w-12 h-12">
                        {chatUser.profileImage ? (
                            <img
                                src={chatUser.profileImage}
                                alt={`${chatUser.name} profil resmi`}
                                className="w-full h-full rounded-full bg-white"
                            />
                        ) : (
                            <div className="p-2 flex text-gray-500 justify-center items-center w-full h-full bg-gray-300 rounded-full">
                                <TbUser size={24} />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <p className="font-medium text-sm text-gray-800">
                            {chatUser.name}
                        </p>
                        <p className="text-sm text-gray-600">
                            {chatUser.bio.length > 32
                                ? `${chatUser.bio.substring(0, 32)}...`
                                : chatUser.bio}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-1 items-end relative">
                    <p className="text-xs text-gray-500">
                        {lastMessageDate
                            ? formatMessageDate(lastMessageDate)
                            : ""}
                    </p>
                    <button
                        onClick={toggleModal}
                        className="w-8 h-8 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    >
                        <TbChevronDown className="text-gray-500 text-lg" />
                    </button>
                    {openModalId === roomId && (
                        <div
                            ref={modalRef}
                            className="absolute top-12 bg-white border border-gray-300 py-2 z-10 divide-gray-100 rounded-lg shadow w-32"
                        >
                            <button
                                onClick={() => handleDeleteRoom(roomId)}
                                className="text-sm w-full text-gray-700 cursor-pointer px-4 py-2 hover:bg-gray-100"
                            >
                                Sohbeti sil
                            </button>
                            <button
                                onClick={() => handleDeleteRoom(roomId)}
                                className="text-sm sm w-full text-gray-700 cursor-pointer px-4 py-2 hover:bg-gray-100"
                            >
                                Engelle
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatUserItem;
