import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const apiClient = axios.create({
    baseURL: "http://localhost:3000/api",
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
        if (error.response?.status === 401) {
            const { logout, setAccessToken, setRefreshToken } =
                useAuthStore.getState();

            try {
                const refreshResponse = await apiClient.post("/auth/refresh");
                const newAccessToken = refreshResponse.data.accessToken;
                const newRefreshToken = refreshResponse.data.refreshToken;

                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);

                error.config.headers[
                    "Authorization"
                ] = `Bearer ${newAccessToken}`;
                return apiClient(error.config);
            } catch (refreshError) {
                console.error("Token yenileme başarısız:", refreshError);
                logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
