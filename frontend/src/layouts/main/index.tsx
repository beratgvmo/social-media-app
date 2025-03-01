import { Outlet, useLocation, useParams } from "react-router-dom";
import Header from "@/components/header";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import ProfileSidebar from "@/components/profileSidebar";
import RightbarFollow from "@/components/rightbarFollow";
import SettingsSidebar from "@/components/settingsSidebar";

const MainLayout: React.FC = () => {
    const [isInputFocused, setIsInputFocused] = useState(false);
    const { user } = useAuthStore();
    const location = useLocation();
    const { slug } = useParams<{ slug?: string }>();

    const handleOverlayClick = () => {
        setIsInputFocused(false);
    };

    const renderSidebars = () => {
        switch (true) {
            case location.pathname === "/":
                return (
                    <>
                        <ProfileSidebar />
                        <div className="min-w-[570px]">
                            <Outlet />
                        </div>
                        <RightbarFollow />
                    </>
                );
            case location.pathname.startsWith("/mynetwork"):
                return (
                    <>
                        <ProfileSidebar />
                        <div className="w-full">
                            <Outlet />
                        </div>
                    </>
                );
            case location.pathname.startsWith("/profile"):
                return (
                    <>
                        {slug === user?.slug ? (
                            <SettingsSidebar />
                        ) : (
                            <ProfileSidebar />
                        )}
                        <div className="min-w-[570px]">
                            <Outlet />
                        </div>
                        <RightbarFollow />
                    </>
                );
            case location.pathname.startsWith("/saved"):
                return (
                    <>
                        <SettingsSidebar />
                        <div className="min-w-[570px]">
                            <Outlet />
                        </div>
                        <RightbarFollow />
                    </>
                );
            default:
                return (
                    <div className="min-w-[570px]">
                        <Outlet />
                    </div>
                );
        }
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
                <div className="flex gap-5">
                    {user ? renderSidebars() : <Outlet />}
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
