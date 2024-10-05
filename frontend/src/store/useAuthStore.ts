import { create } from "zustand";
import { persist, PersistStorage, StorageValue } from "zustand/middleware";

interface User {
    id: number;
    name: string;
    email: string;
    slug: string;
    profileImage: string | null;
}

interface AuthStore {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    setUser: (user: User) => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

const zustandLocalStorage: PersistStorage<AuthStore> = {
    getItem: (name: string): StorageValue<AuthStore> | null => {
        const storedValue = localStorage.getItem(name);
        if (storedValue) {
            return JSON.parse(storedValue) as StorageValue<AuthStore>;
        }
        return null;
    },
    setItem: (name: string, value: StorageValue<AuthStore>) => {
        localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name: string) => {
        localStorage.removeItem(name);
    },
};

export const useAuthStore = create(
    persist<AuthStore>(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            setUser: (user) => set({ user }),
            setTokens: (accessToken, refreshToken) =>
                set({ accessToken, refreshToken }),
            logout: () =>
                set({ user: null, accessToken: null, refreshToken: null }),
        }),
        {
            name: "auth-storage",
            storage: zustandLocalStorage, // Zustand uyumlu localStorage işlemleri
        }
    )
);
