import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProfilePage from "../pages/ProfilePage";
import {
    PrivateRouteNullUser,
    PrivateRouteUser,
} from "../components/PrivateRoute";
import MainLayout from "../layouts/main";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/profile",
                element: (
                    <PrivateRouteUser>
                        <ProfilePage />
                    </PrivateRouteUser>
                ),
            },
        ],
    },
    {
        path: "/login",
        element: (
            <PrivateRouteNullUser>
                <Login />
            </PrivateRouteNullUser>
        ),
    },
    {
        path: "/register",
        element: (
            <PrivateRouteNullUser>
                <Register />
            </PrivateRouteNullUser>
        ),
    },
]);

export default routes;
