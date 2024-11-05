import { Outlet } from "react-router-dom";
import Header from "@/components/header";

const ChatLayout: React.FC = () => {
    return (
        <div className="bg-amber-950/5 h-screen overflow-hidden max-h-screen flex flex-col">
            <Header />
            <div className="w-full h-full flex-1">
                <Outlet />
            </div>
        </div>
    );
};

export default ChatLayout;
