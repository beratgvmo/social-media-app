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
            setLoading(false);
            const response = await axios.get(`/follower/status/${id}`);
            setIsFollowing(response.data.isFollowing);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(true);
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
            <div className="flex gap-3 mt-3 border-b pb-4 w-full">
                <Link to={`/profile/${slug}`}>
                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt="Profil Resmi"
                            className="w-12 h-12 rounded-full border"
                        />
                    ) : (
                        <TbUser className="w-12 h-12 p-2 flex items-center border rounded-full text-blue-500" />
                    )}
                </Link>
                <div className="w-[70%]">
                    <Link to={`/profile/${slug}`}>
                        <p className="font-medium text-gray-800">{name}</p>
                        <p className="text-gray-700 text-xs mb-3">
                            backend developer
                        </p>
                    </Link>
                    {loading && (
                        <div>
                            {isFollowing ? (
                                <Button onClick={onUnfollow} variant="outline">
                                    Takibi Bırak
                                </Button>
                            ) : (
                                <Button onClick={onFollow} variant="rounded">
                                    Takip Et
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProfileCard;
