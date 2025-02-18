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
                // Refresh token ile yeni access token al
                const refreshResponse = await apiClient.post("/auth/refresh");
                const newAccessToken = refreshResponse.data.accessToken;
                const newRefreshToken = refreshResponse.data.refreshToken; // Eğer refresh token da alınıyorsa

                // Store'da yeni token'ları güncelle
                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken); // Yeni refresh token'ı da kaydet

                // Yeni access token ile eski isteği tekrar gönder
                error.config.headers[
                    "Authorization"
                ] = `Bearer ${newAccessToken}`;
                return apiClient(error.config); // Yeniden istek gönder
            } catch (refreshError) {
                console.error("Token yenileme başarısız:", refreshError);
                logout(); // Token yenileme başarısızsa kullanıcıyı logout et
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
