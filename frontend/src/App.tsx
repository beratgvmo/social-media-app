import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import axios from "./utils/axiosInstance";
import routes from "./routes";

import { TbChessFilled } from "react-icons/tb";
import { CgSpinner } from "react-icons/cg";

const App: React.FC = () => {
    const { setUser, logout, setTokens, accessToken, refreshToken } =
        useAuthStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoginStatus = async () => {
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

    if (loading)
        return (
            <div className="min-h-screen min-w-full flex justify-center items-center flex-col pb-20">
                <div className="flex items-center justify-center mb-6">
                    <TbChessFilled size={40} className="text-blue-600" />
                    <p className="text-3xl font-semibold text-blue-600">
                        Sosyal Medya
                    </p>
                </div>
                <CgSpinner className="animate-spin text-blue-600" size={45} />
            </div>
        );
    return <RouterProvider router={routes} />;
};

export default App;
