import { useEffect } from "react";
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

interface NotificationsProps {
    notifications: Notification[];
}

const Notifications: React.FC<NotificationsProps> = ({ notifications }) => {
    useEffect(() => {
        const markAsRead = async (notificationId: number) => {
            try {
                await axios.post(`/notification/read/${notificationId}`);
            } catch (error) {
                console.error(
                    "Bildirim okundu olarak işaretlenirken hata oluştu:",
                    error
                );
            }
        };

        notifications.forEach((notification) => {
            if (!notification.isRead) {
                markAsRead(notification.id);
            }
        });
    }, [notifications]);

    return (
        <div className="absolute right-0 top-10 bg-white py-1 w-80 h-[430px] rounded-lg border shadow">
            <p className="py-2 px-4 border-b">Bildirimler</p>
            {notifications.length > 0 ? (
                <div>
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={
                                notification.isRead
                                    ? `pl-1.5 pr-2 py-3 hover:bg-gray-100 transition`
                                    : `pl-1.5 pr-2 py-3 bg-blue-100 hover:bg-blue-200 transition`
                            }
                        >
                            <div className="flex gap-2">
                                <div className="flex items-center justify-center w-1.5">
                                    {!notification.isRead && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    )}
                                </div>
                                <div>
                                    {notification.fromUser?.profileImage ? (
                                        <img
                                            src={
                                                notification.fromUser
                                                    .profileImage
                                            }
                                            alt="Profile Image"
                                            className="w-9 h-9 rounded-full border"
                                        />
                                    ) : (
                                        <TbUser className="w-9 h-9 p-1 border rounded-full text-blue-500" />
                                    )}
                                </div>
                                <div className="ml-1 flex flex-col gap-1">
                                    <div className="text-sm text-gray-900">
                                        <span className="font-medium">
                                            {notification.fromUser?.name}
                                        </span>
                                        <span>
                                            {" "}
                                            gönderinize{" "}
                                            {notification.type === "like"
                                                ? "beğendi"
                                                : notification.type ===
                                                  "comment"
                                                ? "yorum yaptı"
                                                : "sizi takip etmek istiyor"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        <TimeAgo
                                            createdAt={notification.createdAt}
                                        />
                                    </p>
                                </div>
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
