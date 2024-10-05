import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { TbChessFilled } from "react-icons/tb";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen flex flex-col">
            <header className="h-16 p-1 flex items-center bg-white border-b border-gray-300">
                <div className="w-[1100px] mx-auto flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                        <Link to="/">
                            <TbChessFilled
                                size={40}
                                className="text-blue-600"
                            />
                        </Link>
                    </div>
                </div>
            </header>
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h1 className="text-2xl font-medium">
                        Böyle bir sayfa yok
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Lütfen URL adresini kontrol edin
                    </p>
                    <p className="mb-4 text-gray-600">
                        veya ana sayfasına dönün.
                    </p>
                    <Button variant="outline" onClick={() => navigate("/")}>
                        Ana sayfaya dön
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
