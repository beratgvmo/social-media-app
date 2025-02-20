import { User } from "@/types";
import Cookies from "js-cookie";
import { create } from "zustand";

interface AuthStore {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    setUser: (user: User) => void;
    setAccessToken: (token: string | null) => void;
    setRefreshToken: (token: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    setUser: (user) => set({ user }),
    setAccessToken: (token) => set({ accessToken: token }),
    setRefreshToken: (token) => set({ refreshToken: token }),
    logout: () => {
        Cookies.remove("refreshToken");
        set({ user: null, accessToken: null, refreshToken: null });
    },
}));
