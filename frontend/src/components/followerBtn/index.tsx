import { useEffect } from "react";
import { useFollowerStore } from "@/store/useFollowerStore";
import Button from "../button";
import { CgSpinner } from "react-icons/cg";

const FollowerBtn: React.FC<{ id: number }> = ({ id }) => {
    const {
        isFollowing,
        loadingFollow,
        checkFollowingStatus,
        onFollow,
        onUnfollow,
    } = useFollowerStore();

    useEffect(() => {
        checkFollowingStatus(id);
    }, [id]);

    return (
        <div>
            {loadingFollow[id] ? (
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
                <>
                    {isFollowing[id] === null && (
                        <Button onClick={() => onFollow(id)} variant="rounded">
                            Takip Et
                        </Button>
                    )}
                    {isFollowing[id] === "accepted" && (
                        <Button
                            onClick={() => onUnfollow(id)}
                            variant="outline"
                        >
                            Takibi Bırak
                        </Button>
                    )}
                    {isFollowing[id] === "pending" && (
                        <Button
                            onClick={() => onUnfollow(id)}
                            variant="outline"
                        >
                            İstek Gönderildi
                        </Button>
                    )}
                </>
            )}
        </div>
    );
};

export default FollowerBtn;
