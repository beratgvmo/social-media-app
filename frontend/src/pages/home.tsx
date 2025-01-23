import { useEffect } from "react";
import HomeUser from "@/components/homeUser";
import HomeUserNull from "@/components/homeUserNull";
import { useAuthStore } from "@/store/useAuthStore";

const Home: React.FC = () => {
    const { user } = useAuthStore();

    return user ? <HomeUser /> : <HomeUserNull />;
};

export default Home;
