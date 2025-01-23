import Cookies from "js-cookie";
import { create } from "zustand";

interface User {
    id: number;
    name: string;
    email: string;
    slug: string;
    bio: string;
    profileImage: string | null;
    bannerImage: string | null;
    followerCount: number;
    followingCount: number;
}

interface AuthStore {
    user: User | null;
    accessToken: string | null;
    setUser: (user: User) => void;
    logout: () => void;
    setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    accessToken: null,
    setUser: (user) => set({ user }),
    setAccessToken: (token) => set({ accessToken: token }),
    logout: () => {
        Cookies.remove("refreshToken");
        set({ user: null, accessToken: null });
    },
}));
