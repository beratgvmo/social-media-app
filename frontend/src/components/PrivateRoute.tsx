import { ReactNode, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import MyProfile from "../pages/MyProfile";
import Profile from "../pages/Profile";
import axios from "../utils/axiosInstance";
import Loading from "./Loading";

interface Props {
    children: ReactNode;
}

const PrivateRouteNullUser: React.FC<Props> = ({ children }) => {
    const { user } = useAuthStore();

    if (user) {
        return <Navigate to={`/profile/${user.slug}`} />;
    }

    return <>{children}</>;
};

const PrivateRouteProfile: React.FC = () => {
    const { user } = useAuthStore();
    const { slug } = useParams<{ slug: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/user/profile/${slug}`);

                if (!response.data) {
                    setError("not found");
                }
            } catch (err) {
                setError("not found");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [slug]);

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (error === "not found") {
        return <Navigate to="/404" />;
    }

    if (user?.slug === slug) {
        return <MyProfile />;
    }

    return <Profile />;
};

export { PrivateRouteNullUser, PrivateRouteProfile };
