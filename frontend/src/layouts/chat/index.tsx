import { Outlet } from "react-router-dom";
import Header from "@/components/header";

const ChatLayout: React.FC = () => {
    return (
        <div className="flex flex-col h-screen w-screen bg-amber-950/5 overflow-hidden">
            <div className="flex-none">
                <Header />
            </div>

            <div className="w-full border rounded-md max-w-[1100px] mx-auto flex-1 overflow-hidden my-5">
                <Outlet />
            </div>
        </div>
    );
};

export default ChatLayout;
