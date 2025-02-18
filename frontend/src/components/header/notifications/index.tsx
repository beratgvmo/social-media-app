import { useEffect, useState } from "react";
import axios from "@/utils/axiosInstance";
import TimeAgo from "@/components/TimeAgo";
import { TbUser } from "react-icons/tb";

interface User {
    name: string;
    profileImage: string | null;
    slug: string;
}

interface Notification {
    id: number;
    type: "like" | "comment" | "follow";
    isRead: boolean;
    createdAt: Date;
    fromUser: User;
}

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    useEffect(() => {
        const notification = async () => {
            try {
                const reponse = await axios.get(`notification`);
                setNotifications(reponse.data);
            } catch (error) {
                console.error(
                    "Bildirim okundu olarak işaretlenirken hata oluştu:",
                    error
                );
            }
        };

        notification();
    }, []);

    return (
        <div className="absolute right-0 top-10 h-[500px] bg-white w-80 rounded-lg border shadow">
            <p className="py-2 px-4 border-b">Bildirimler</p>
            {notifications.length > 0 ? (
                <div className="overflow-auto h-[458px] bg-white rounded-b-lg scrollbar-transition thin-scrollbar">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`flex items-center relative cursor-pointer gap-3 px-4 py-3 transition ${
                                notification.isRead
                                    ? "hover:bg-gray-100"
                                    : "bg-blue-50 hover:bg-blue-100"
                            }`}
                        >
                            {!notification.isRead && (
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            )}
                            {notification.fromUser?.profileImage ? (
                                <img
                                    src={notification.fromUser.profileImage}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full border"
                                />
                            ) : (
                                <TbUser className="w-10 h-10 p-1 border rounded-full text-blue-500" />
                            )}
                            <div className="flex flex-col">
                                <p className="text-sm text-gray-900">
                                    <span className="font-medium">
                                        {notification.fromUser?.name}
                                    </span>{" "}
                                    {notification.type === "like"
                                        ? "gönderinizi beğendi."
                                        : notification.type === "comment"
                                        ? "gönderinize yorum yaptı."
                                        : "sizi takip etmek istiyor."}
                                </p>
                                <p className="text-xs absolute bottom-2 right-3 flex justify-end text-gray-500">
                                    <TimeAgo
                                        createdAt={notification.createdAt}
                                    />
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-sm mt-2 text-gray-600 ">
                    Yeni bildirim yok
                </div>
            )}
        </div>
    );
};

export default Notifications;
