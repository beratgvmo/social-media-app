import Cookies from "js-cookie";
import { create } from "zustand";

interface User {
    id: number;
    name: string;
    email: string;
    slug: string;
    bio: string;
    isPrivate: boolean;
    profileImage: string | null;
    bannerImage: string | null;
    followerCount: number;
    followingCount: number;
}

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
