import { createBrowserRouter } from "react-router-dom"
import App from "../App";
import Auth from "../components/Auth/Auth";
import Navigation from "../components/Navigation/Navigation";
import Board from "../components/Board/Board";

const router = createBrowserRouter([
    {
        path: "login",
        element: <Auth />
    },
    {
        path: "/",
        element: <Navigation />,
        children: [
            {
                path: "projects/:projectId",
                element: <Board />,
            },
        ]
    },
]);

export default router