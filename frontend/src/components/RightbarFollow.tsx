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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFriendProfile = async () => {
            try {
                const response = await axios.get<Friend[]>(
                    "/user/friend-profile"
                );
                setFriends(response.data);
            } catch (error) {
                console.error("Error fetching friend profiles:", error);
                setError("Bir hata oluştu. Daha sonra tekrar deneyin.");
            } finally {
                setLoading(false);
            }
        };

        fetchFriendProfile();
    }, []);

    if (error) {
        return (
            <div className="min-w-[300px] bg-white px-4 py-3 rounded-lg border">
                <p className="text-sm text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-w-[300px]">
            <div className="bg-white w-full px-4 py-3 rounded-lg border">
                <p className="text-sm font-medium">
                    Sizin için daha fazla profil
                </p>
                {Array.isArray(friends) && friends.length > 0 ? (
                    friends.map((friend) => (
                        <ProfileCard
                            key={friend.id}
                            id={friend.id}
                            name={friend.name}
                            slug={friend.slug}
                            profileImage={friend.profileImage}
                        />
                    ))
                ) : (
                    <p className="text-sm text-gray-500">
                        Gösterilecek profil bulunamadı.
                    </p>
                )}
            </div>
        </div>
    );
};

export default RightbarFollow;
