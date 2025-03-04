import { useEffect, useState } from "react";
import { RouterProvider, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "@/utils/axiosInstance";
import routes from "@/routes";
import Loading from "@/components/loading";
import { Navigate } from "react-router-dom";

const App: React.FC = () => {
    const { setUser, logout } = useAuthStore();
    const [loading, setLoading] = useState(true);

    const checkLoginStatus = async () => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        try {
            const response = await axios.post("/auth/refresh");
            setUser(response.data.user);
        } catch (error) {
            logout();
            return <Navigate to="/" />;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, [setUser, logout]);

    if (loading) return <Loading />;
    return <RouterProvider router={routes} />;
};

export default App;
