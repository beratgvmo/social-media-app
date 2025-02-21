import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import {
    PrivateRouteAuthenticated,
    PrivateRouteNullUser,
    PrivateRouteProfile,
} from "@/components/PrivateRoute";
import MainLayout from "@/layouts/main";
import NotFound from "@/pages/NotFound";
import MyNetwork from "@/pages/MyNetwork";
import Chat from "@/pages/Chat";
import ChatLayout from "@/layouts/chat";
import MyNetworkFollower from "@/pages/MyNetworkFollower";
import PostSaved from "@/pages/PostSaved";
import PostDetail from "@/pages/PostDetail";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { path: "/", element: <Home /> },
            {
                path: "/profile/:slug",
                element: (
                    <PrivateRouteAuthenticated>
                        <PrivateRouteProfile />
                    </PrivateRouteAuthenticated>
                ),
            },
            {
                path: "/profile/:slug/:postId",
                element: (
                    <PrivateRouteAuthenticated>
                        <PostDetail />
                    </PrivateRouteAuthenticated>
                ),
            },
            {
                path: "/saved",
                element: (
                    <PrivateRouteAuthenticated>
                        <PostSaved />
                    </PrivateRouteAuthenticated>
                ),
            },
            {
                path: "/mynetwork",
                element: (
                    <PrivateRouteAuthenticated>
                        <MyNetwork />
                    </PrivateRouteAuthenticated>
                ),
            },
            {
                path: "/mynetwork/follower",
                element: (
                    <PrivateRouteAuthenticated>
                        <MyNetworkFollower />
                    </PrivateRouteAuthenticated>
                ),
            },
            {
                path: "/mynetwork/following",
                element: (
                    <PrivateRouteAuthenticated>
                        <MyNetworkFollower />
                    </PrivateRouteAuthenticated>
                ),
            },
        ],
    },
    {
        path: "/chat",
        element: <ChatLayout />,
        children: [
            {
                path: "/chat",
                element: (
                    <PrivateRouteAuthenticated>
                        <Chat />
                    </PrivateRouteAuthenticated>
                ),
            },
        ],
    },
    {
        path: "/register",
        element: (
            <PrivateRouteNullUser>
                <Register />
            </PrivateRouteNullUser>
        ),
    },
    { path: "/404", element: <NotFound /> },
    { path: "*", element: <NotFound /> },
]);
export default routes;
