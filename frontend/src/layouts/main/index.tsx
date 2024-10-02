import { Outlet } from "react-router-dom";
import Header from "../../components/Header";

const MainLayout: React.FC = () => {
    return (
        <div className="bg-amber-950/5 min-h-screen">
            <Header />
            <div className="w-[1100px] mx-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
