import { useEffect, useState } from "react";
import { TbUser } from "react-icons/tb";
import ProfileSidebar from "@/components/ProfileSidebar";
import Button from "@/components/button";
import axios from "@/utils/axiosInstance";
import TimeAgo from "@/components/TimeAgo";

interface FollowerRequest {
    id: number;
    createdAt: string;
    status: string;
    isRead: boolean;
    follower: {
        id: number;
        name: string;
        email: string;
        slug: string;
        profileImage: string | null;
        createdAt: string;
    };
}

const MyNetwork: React.FC = () => {
    const [requests, setRequests] = useState<FollowerRequest[]>([]);

    useEffect(() => {
        const fetchFollowerRequests = async () => {
            try {
                const response = await axios.get("follower/pending-requests");
                setRequests(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchFollowerRequests();
    }, []);

    useEffect(() => {
        const markAsRead = async (id: number) => {
            try {
                await axios.post(`/follower/read/${id}`);
            } catch (error) {
                console.error(
                    "Bildirim okundu olarak işaretlenirken hata oluştu:",
                    error
                );
            }
        };

        requests.forEach((request) => {
            if (!request.isRead) {
                markAsRead(request.id);
            }
        });
    }, [requests]);

    const handleRespond = async (followerId: number, isAccepted: boolean) => {
        try {
            await axios.post(`follower/${followerId}/accept`, { isAccepted });

            setRequests((prevRequests) =>
                prevRequests.filter(
                    (request) => request.follower.id !== followerId
                )
            );
        } catch (error) {
            console.error("Yanıt işlemi başarısız:", error);
        }
    };

    return (
        <div className="flex gap-5">
            <ProfileSidebar />
            <div className="w-full">
                <div className="pt-3 bg-white rounded-lg border w-full">
                    <p className="px-4 pb-3">Davetler</p>
                    <div>
                        {requests.length > 0 ? (
                            requests.map((request) => (
                                <div
                                    key={request.follower.id}
                                    className="flex px-4 border-t justify-between items-center py-3"
                                >
                                    <div className="flex items-center gap-1.5">
                                        {request.follower?.profileImage ? (
                                            <img
                                                src={
                                                    request.follower
                                                        .profileImage
                                                }
                                                alt="Profil Resmi"
                                                className="w-14 h-14 rounded-full border-4 bg-white border-white"
                                            />
                                        ) : (
                                            <TbUser className="w-14 h-14 p-2 flex items-center border rounded-full text-blue-500" />
                                        )}
                                        <div className="flex flex-col gap-1">
                                            <p className="font-medium text-gray-800">
                                                {request.follower.name}
                                            </p>
                                            <p className="text-xs text-gray-700">
                                                <TimeAgo
                                                    createdAt={
                                                        request.createdAt
                                                    }
                                                />
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2.5">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                handleRespond(
                                                    request.follower.id,
                                                    false
                                                )
                                            }
                                        >
                                            Yoksay
                                        </Button>
                                        <Button
                                            variant="rounded"
                                            onClick={() =>
                                                handleRespond(
                                                    request.follower.id,
                                                    true
                                                )
                                            }
                                        >
                                            Kabul Et
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="px-4 border-t py-3 text-gray-500">
                                Bekleyen davet yok.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyNetwork;
