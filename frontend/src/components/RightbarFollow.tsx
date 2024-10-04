import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import ProfileCard from "./ProfileCard";

interface Friend {
    id: number;
    name: string;
    profileImage: string;
}

const RightbarFollow: React.FC = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // JWT token ile friend profile API'sine istek yapma
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
    return (
        <div className="w-[300px]">
            <div className="bg-white w-full px-4 py-3 rounded-lg border">
                <p className="text-sm font-medium">
                    Sizin için daha fazla profil
                </p>
                {!loading &&
                    friends.map((friend) => (
                        <ProfileCard
                            key={friend.id}
                            id={friend.id}
                            name={friend.name}
                            profileImage={friend.profileImage}
                        />
                    ))}
            </div>
        </div>
    );
};

export default RightbarFollow;
