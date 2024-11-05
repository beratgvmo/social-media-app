import { useEffect, useRef, useState } from "react";
import axios from "../utils/axiosInstance";
import { useAuthStore } from "@/store/useAuthStore";
import { TbChessFilled, TbSearch, TbUser } from "react-icons/tb";
import TimeAgo from "@/components/TimeAgo";

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

const ChatComponent: React.FC = ({}) => {
    const [chatRooms, setchatRooms] = useState<RoomChat[]>([]);
    const [thisRooms, setThisRooms] = useState<number>();
    const { user } = useAuthStore();

    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputClick = () => {
        inputRef.current?.focus();
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`chat/userRooms/${user.id}`);
                setchatRooms(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Mesajları alırken hata oluştu:", error);
            }
        };

        fetchMessages();
    }, []);

    return (
        <div className="w-full h-full flex items-center">
            <div className="w-2/6 h-full bg-white p-4 border-r">
                <p className="text-xl font-medium mb-3 ml-2">Sohbetler</p>
                <div
                    onClick={handleInputClick}
                    className="w-full flex items-center border-2 mb-3 border-gray-300 rounded-md focus-within:border-blue-500 px-2 hover:cursor-pointer"
                >
                    <TbSearch className="text-gray-500 text-lg" />
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-full p-1.5 text-sm outline-none focus:outline-none"
                        placeholder="Aratın veya yeni sohbet başlatın"
                    />
                </div>

                {chatRooms.map((room) => (
                    <div
                        className={`px-3 py-2  rounded-md mt-1 transition ${
                            thisRooms === room.id
                                ? "hover:bg-gray-200 bg-gray-200/60"
                                : "hover:bg-gray-200/40"
                        }`}
                    >
                        {user.id != room.user1.id && (
                            <div
                                className="flex gap-3"
                                onClick={() => setThisRooms(room.id)}
                            >
                                <div className="w-12 h-12">
                                    {room.user2?.profileImage ? (
                                        <img
                                            src={room.user1.profileImage}
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
                                        {room.user1.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        merhaba ben berat
                                    </p>
                                </div>
                            </div>
                        )}

                        {user.id != room.user2.id && (
                            <div
                                className="flex gap-3"
                                onClick={() => setThisRooms(room.id)}
                            >
                                <div className="w-12 h-12">
                                    {room.user2?.profileImage ? (
                                        <img
                                            src={room.user2.profileImage}
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
                                        {room.user2.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        merhaba ben berat
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="h-full w-full ">
                {!thisRooms && (
                    <div className="flex flex-col items-center  justify-center pb-6 w-full h-full">
                        <TbChessFilled className="text-gray-400 text-5xl" />
                        <div className="flex flex-col mt-1 items-center justify-center">
                            <p className="text-gray-700">
                                Arkadaşlarla Sohbet etmek
                            </p>
                            <p className="text-gray-500 text-sm">
                                için güzel bir gün
                            </p>
                        </div>
                    </div>
                )}
                {thisRooms && (
                    <div className="w-full h-full">
                        <div className="h-16 bg-white pl-4 flex items-center">
                            {chatRooms.map(
                                (room) =>
                                    thisRooms === room.id && (
                                        <div className="">
                                            {user.id != room.user1.id && (
                                                <div
                                                    className="flex gap-2 items-center"
                                                    onClick={() =>
                                                        setThisRooms(room.id)
                                                    }
                                                >
                                                    <div className="w-10 h-10">
                                                        {room.user1
                                                            ?.profileImage ? (
                                                            <img
                                                                src={
                                                                    room.user1
                                                                        .profileImage
                                                                }
                                                                alt="Profil Resmi"
                                                                className="w-full h-full rounded-full bg-white"
                                                            />
                                                        ) : (
                                                            <div className="p-2 flex text-gray-500 justify-center items-center w-full h-full bg-gray-300 rounded-full">
                                                                <TbUser
                                                                    size={90}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <p className="font-medium text-sm text-gray-800">
                                                            {room.user1.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {user.id != room.user2.id && (
                                                <div
                                                    className="flex gap-2 items-center"
                                                    onClick={() =>
                                                        setThisRooms(room.id)
                                                    }
                                                >
                                                    <div className="w-10 h-10">
                                                        {room.user2
                                                            ?.profileImage ? (
                                                            <img
                                                                src={
                                                                    room.user2
                                                                        .profileImage
                                                                }
                                                                alt="Profil Resmi"
                                                                className="w-full h-full rounded-full bg-white"
                                                            />
                                                        ) : (
                                                            <div className="p-2 flex text-gray-500 justify-center items-center w-full h-full bg-gray-300 rounded-full">
                                                                <TbUser
                                                                    size={90}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <p className="font-medium text-sm text-gray-800">
                                                            {room.user2.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                            )}
                        </div>
                        <div className="w-full h-[83%] bg-red-500"></div>
                        <div className="bg-blue-500 h-14"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatComponent;
