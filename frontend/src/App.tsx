import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import axios from "./utils/axiosInstance";
import routes from "./routes";
import Loading from "./components/Loading";

const App: React.FC = () => {
    const { setUser, logout, setTokens, accessToken, refreshToken } =
        useAuthStore();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoginStatus = async () => {
            await new Promise((resolve) => setTimeout(resolve, 400));
            if (!accessToken && refreshToken) {
                try {
                    const res = await axios.post("/auth/refresh", {
                        refreshToken,
                    });
                    setTokens(res.data.accessToken, res.data.refreshToken);
                } catch (error) {
                    logout();
                }
            }

            if (accessToken) {
                try {
                    const response = await axios.get("/user/profile");
                    setUser(response.data);
                } catch (error) {
                    logout();
                }
            }
            setLoading(false);
        };

        checkLoginStatus();
    }, [accessToken, refreshToken, setUser, setTokens, logout]);

    if (loading) return <Loading />;
    return <RouterProvider router={routes} />;
};

export default App;
