import { ReactNode, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import MyProfile from "@/pages/MyProfile";
import Profile from "@/pages/Profile";
import axios from "@/utils/axiosInstance";

interface Props {
    children: ReactNode;
}

const PrivateRouteNullUser: React.FC<Props> = ({ children }) => {
    const { user } = useAuthStore();

    return user?.slug ? (
        <Navigate to={`/profile/${user.slug}`} />
    ) : (
        <>{children}</>
    );
};

const PrivateRouteProfile: React.FC = () => {
    const { user } = useAuthStore();
    const { slug } = useParams<{ slug?: string }>();
    const [error, setError] = useState<string | null>(null);

    if (!user) return <Navigate to="/" />;
    console.log(user);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                await axios.get(`/user/profile/${slug}`);
                setError(null);
            } catch {
                setError("not found");
            }
        };

        if (slug) fetchProfile();
    }, [slug]);

    if (error === "not found") return <Navigate to="/404" />;

    return user.slug === slug ? <MyProfile /> : <Profile />;
};

const PrivateRouteAuthenticated: React.FC<Props> = ({ children }) => {
    const { user } = useAuthStore();

    return user ? <>{children}</> : <Navigate to="/" />;
};

export { PrivateRouteNullUser, PrivateRouteProfile, PrivateRouteAuthenticated };
