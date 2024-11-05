import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import {
    PrivateRouteNullUser,
    PrivateRouteProfile,
} from "@/components/PrivateRoute";
import MainLayout from "@/layouts/main";
import NotFound from "@/pages/NotFound";
import MyNetwork from "@/pages/MyNetwork";
import Chat from "@/pages/Chat";
import ChatLayout from "@/layouts/chat";

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
                path: "/profile/:slug",
                element: <PrivateRouteProfile />,
            },
            {
                path: "/mynetwork",
                element: <MyNetwork />,
            },
        ],
    },
    {
        path: "/",
        element: <ChatLayout />,
        children: [
            {
                path: "/chat",
                element: <Chat />,
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
    {
        path: "/404",
        element: <NotFound />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default routes;
