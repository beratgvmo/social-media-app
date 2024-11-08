import { Outlet } from "react-router-dom";
import Header from "@/components/header";

const ChatLayout: React.FC = () => {
    return (
        <div className="bg-amber-950/5 h-screen w-screen max-w-screen max-h-screen overflow-hidden">
            <Header />
            <div className="w-full h-[92%]">
                <Outlet />
            </div>
        </div>
    );
};

export default ChatLayout;
