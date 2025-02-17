import { Outlet } from "react-router-dom";
import Header from "@/components/header";
import { useState } from "react";

const ChatLayout: React.FC = () => {
    const [isInputFocused, setIsInputFocused] = useState(false);

    const handleOverlayClick = () => {
        setIsInputFocused(false);
    };
    return (
        <div className="flex flex-col h-screen bg-amber-950/5 overflow-hidden">
            <Header
                setInputFocus={setIsInputFocused}
                isInputFocused={isInputFocused}
            />
            {isInputFocused && (
                <div
                    className="fixed inset-0 bg-black/50 z-10"
                    onClick={handleOverlayClick}
                ></div>
            )}

            <div className="w-full max-w-[1100px] mx-auto flex-1 my-5 overflow-auto border z-0 rounded-md">
                <Outlet />
            </div>
        </div>
    );
};

export default ChatLayout;
