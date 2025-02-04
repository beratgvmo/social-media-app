import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";

interface SearchState {
    recentSearches: string[];
    addSearch: (search: string) => void;
    clearSearches: () => void;
}

const localStoragePersist: PersistStorage<SearchState> = {
    getItem: (name) => {
        const value = localStorage.getItem(name);
        return value ? JSON.parse(value) : null;
    },
    setItem: (name, value) => {
        localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name) => {
        localStorage.removeItem(name);
    },
};

export const useSearchStore = create<SearchState>()(
    persist(
        (set, get) => ({
            recentSearches: [],
            addSearch: (search) => {
                const updatedSearches = [
                    search,
                    ...get().recentSearches.filter((s) => s !== search),
                ].slice(0, 4);
                set({ recentSearches: updatedSearches });
            },
            clearSearches: () => set({ recentSearches: [] }),
        }),
        {
            name: "recent-searches",
            storage: localStoragePersist,
        }
    )
);

export default useSearchStore;
