import { useEffect, useState } from "react";
import axios from "@/utils/axiosInstance";
import Button from "@/components/button";

interface FollowProps {
    id: number;
}

const FollowBtn: React.FC<FollowProps> = ({ id }) => {
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
            setLoading(true);
            await axios.post(`/follower/follow/${id}`);
            setIsFollowing(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onUnfollow = async () => {
        try {
            setLoading(true);
            await axios.delete(`/follower/unfollow/${id}`);
            setIsFollowing(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkFollowingStatus();
    }, []);

    return (
        <>
            {isFollowing ? (
                <Button
                    onClick={onUnfollow}
                    disabled={loading}
                    variant="outline"
                >
                    Takibi Bırak
                </Button>
            ) : (
                <Button onClick={onFollow} disabled={loading} variant="rounded">
                    Takip Et
                </Button>
            )}
        </>
    );
};

export default FollowBtn;
