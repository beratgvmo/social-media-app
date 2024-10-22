import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import Button from "./Button";
import { TbUser } from "react-icons/tb";
import { Link } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";

interface Friend {
    id: number;
    name: string;
    profileImage: string;
    slug: string;
}

const ProfileCard: React.FC<Friend> = ({ id, name, profileImage, slug }) => {
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState<string | null>(null);

    const checkFollowingStatus = async () => {
        try {
            setLoading(true);
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
            checkFollowingStatus();
        } catch (error) {
            console.error(error);
        }
    };

    const onUnfollow = async () => {
        try {
            await axios.delete(`/follower/unfollow/${id}`);
            checkFollowingStatus();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        checkFollowingStatus();
    }, []);

    return (
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
                        Backend Developer
                    </p>
                </Link>
                {loading ? (
                    <Button
                        variant="outline"
                        className="w-20 flex items-center justify-center"
                    >
                        <CgSpinner
                            size={20}
                            className="animate-spin text-blue-600"
                        />
                    </Button>
                ) : (
                    <div>
                        {isFollowing === null && (
                            <Button onClick={onFollow} variant="rounded">
                                Takip Et
                            </Button>
                        )}

                        {isFollowing === "accepted" && (
                            <Button onClick={onUnfollow} variant="outline">
                                Takibi Bırak
                            </Button>
                        )}

                        {isFollowing === "pending" && (
                            <Button onClick={onUnfollow} variant="outline">
                                İstek Gönderildi
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileCard;
