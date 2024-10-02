import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface Props {
    children: ReactNode;
}

const PrivateRouteNullUser: React.FC<Props> = ({ children }) => {
    const { user } = useAuthStore();

    if (user) {
        return <Navigate to="/profile" />;
    }

    return <>{children}</>;
};

const PrivateRouteUser: React.FC<Props> = ({ children }) => {
    const { user } = useAuthStore();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};

export { PrivateRouteNullUser, PrivateRouteUser };
