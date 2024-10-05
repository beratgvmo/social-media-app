import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import Button from "./Button";
import { TbUser } from "react-icons/tb";
import { Link } from "react-router-dom";

interface Friend {
    id: number;
    name: string;
    profileImage: string;
    slug: string;
}

const ProfileCard: React.FC<Friend> = ({ id, name, profileImage, slug }) => {
    const [loading, setLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const checkFollowingStatus = async () => {
        try {
            const response = await axios.get(`/follower/status/${id}`);
            setIsFollowing(response.data.isFollowing);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onFollow = async () => {
        try {
            await axios.post(`/follower/follow/${id}`);
            setIsFollowing(true);
        } catch (error) {
            console.error(error);
        }
    };

    const onUnfollow = async () => {
        try {
            await axios.delete(`/follower/unfollow/${id}`);
            setIsFollowing(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        checkFollowingStatus();
    }, []);

    return (
        <>
            <Link to={`/profile/${slug}`}>
                <div className="flex gap-2 mt-3 border-b pb-4">
                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt="Profil Resmi"
                            className="w-11 h-11 rounded-full border"
                        />
                    ) : (
                        <TbUser className="w-10 h-10 p-2 flex items-center border rounded-full text-blue-500" />
                    )}
                    <div>
                        <p className="font-medium text-gray-800">{name}</p>
                        <p className="text-gray-700 text-xs mb-2">
                            backend developer
                        </p>
                        <div>
                            {isFollowing ? (
                                <Button
                                    onClick={onUnfollow}
                                    disabled={loading}
                                    variant="outline"
                                >
                                    Takibi Bırak
                                </Button>
                            ) : (
                                <Button
                                    onClick={onFollow}
                                    disabled={loading}
                                    variant="rounded"
                                >
                                    Takip Et
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
};

export default ProfileCard;
