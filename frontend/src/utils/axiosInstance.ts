import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const { getState, setState } = useAuthStore;

const apiClient = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const { accessToken } = getState(); // Store'un state'ine doğrudan erişim
    if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                const refreshResponse = await apiClient.post("/auth/refresh");
                const newAccessToken = refreshResponse.data.accessToken;

                setState({ accessToken: newAccessToken });
                error.config.headers[
                    "Authorization"
                ] = `Bearer ${newAccessToken}`;
                return apiClient(error.config); // Yeniden istek gönder
            } catch (refreshError) {
                console.error("Token yenileme başarısız", refreshError);
                // Kullanıcıyı giriş sayfasına yönlendirme veya hata mesajı gösterme
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
