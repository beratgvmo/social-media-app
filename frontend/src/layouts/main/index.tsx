import { Outlet } from "react-router-dom";
import Header from "@/components/header";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const MainLayout: React.FC = () => {
    const [isInputFocused, setIsInputFocused] = useState(false);
    const { user } = useAuthStore();

    const handleOverlayClick = () => {
        setIsInputFocused(false);
    };

    return (
        <div className="relative bg-amber-950/5 min-h-screen">
            {user && (
                <Header
                    setInputFocus={setIsInputFocused}
                    isInputFocused={isInputFocused}
                />
            )}
            {isInputFocused && (
                <div
                    className="fixed inset-0 bg-black/50 z-10"
                    onClick={handleOverlayClick}
                ></div>
            )}
            <div
                className={`relative w-full max-w-[1100px] h-full mx-auto transition-colors pt-6 ${
                    isInputFocused ? "z-0" : "z-10"
                }`}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
