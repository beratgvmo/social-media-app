// axiosInstance.ts
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const apiClient = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const { refreshToken, setTokens } = useAuthStore.getState();

            if (refreshToken) {
                try {
                    const res = await apiClient.post("/auth/refresh", {
                        refreshToken,
                    });
                    setTokens(res.data.accessToken, res.data.refreshToken);
                    apiClient.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${res.data.accessToken}`;
                    return apiClient(originalRequest);
                } catch (err) {
                    console.error("Refresh token failed, logging out...");
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
