import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import ProfileCard from "./ProfileCard";

interface Friend {
    id: number;
    name: string;
    profileImage: string;
    slug: string;
}

const RightbarFollow: React.FC = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFriendProfile = async () => {
            try {
                const response = await axios.get("/user/friend-profile");
                setFriends(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriendProfile();
    }, []);

    if (loading) {
        return (
            <div>
                <div className="w-[300px] bg-white px-4 py-3 rounded-lg space-y-4 border border-gray-200 divide-y divide-gray-200 shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                        <div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                        <div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                        <div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                        <div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                    </div>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-w-[300px]">
            <div className="bg-white w-full px-4 py-3 rounded-lg border">
                <p className="text-sm font-medium">
                    Sizin için daha fazla profil
                </p>
                {friends.map((friend) => (
                    <ProfileCard
                        key={friend.id}
                        id={friend.id}
                        name={friend.name}
                        slug={friend.slug}
                        profileImage={friend.profileImage}
                    />
                ))}
            </div>
        </div>
    );
};

export default RightbarFollow;
