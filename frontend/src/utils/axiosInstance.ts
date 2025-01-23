import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const apiClient = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState(); // Store'un state'ine doğrudan erişim
    if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await apiClient.post("/auth/refresh");
                const newAccessToken = refreshResponse.data.accessToken;

                const { setAccessToken } = useAuthStore.getState();
                setAccessToken(newAccessToken);

                originalRequest.headers[
                    "Authorization"
                ] = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            } catch (err) {
                console.error(
                    "Refresh token expired or invalid. Logging out..."
                );

                const { setAccessToken, setUser } = useAuthStore.getState();
                setAccessToken(null);
                setUser(null);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
