import React from "react";
import axios from "@/utils/axiosInstance";
import { TbUser } from "react-icons/tb";

const FriendItem = ({ friend, handleModalClose, setThisRoom }) => {
    const handleCreateRoom = async (userId: number) => {
        try {
            const response = await axios.post(`chat/create-room/${userId}`);
            console.log("Room created:", response.data);
            setThisRoom(response.data.id);
            handleModalClose();
        } catch (error) {
            console.error("Error creating room:", error);
        }
    };

    return (
        <div
            key={friend.id}
            className="flex items-center gap-2 mb-1.5 cursor-pointer hover:bg-gray-200 p-2 rounded-md transition"
            onClick={() => {
                handleCreateRoom(friend.id);
                handleModalClose();
            }}
        >
            <div className="w-10 h-10">
                {friend.profileImage ? (
                    <img
                        src={friend.profileImage}
                        alt="Profil Resmi"
                        className="w-full h-full rounded-full bg-white"
                    />
                ) : (
                    <div className="p-2 flex text-gray-500 justify-center items-center w-full h-full bg-gray-300 rounded-full">
                        <TbUser size={90} />
                    </div>
                )}
            </div>
            <div>
                <p className="font-medium text-sm text-gray-800">
                    {friend.name}
                </p>
            </div>
        </div>
    );
};

export default FriendItem;
