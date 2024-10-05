import { Outlet } from "react-router-dom";
import Header from "../../components/Header";

const MainLayout: React.FC = () => {
    return (
        <div className="bg-amber-950/5 min-h-screen">
            <Header />
            <div className="w-full max-w-[1100px] h-full mx-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
