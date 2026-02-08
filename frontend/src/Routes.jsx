import React, { useEffect } from "react";
import { useNavigate, useRoutes, useLocation } from "react-router-dom";

// Pages
import { DashBoard } from "./components/dashboard/DashBoard.jsx";
import { User } from "./components/user/User.jsx";
import { Login } from "./components/auth/Login.jsx";
import { Signup } from "./components/auth/Signup.jsx";

// Auth Context
import { useAuth } from "./AuthContext.jsx";

const ProjectRoutes = () => {
    const { currentUser, setCurrentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const userIdFromStorage = localStorage.getItem("userId");

        if (userIdFromStorage && !currentUser) {
            setCurrentUser(userIdFromStorage);
        }

        if (!userIdFromStorage && !["/auth", "/signup"].includes(location.pathname)) {
            navigate("/auth");
        }

        if (userIdFromStorage && location.pathname === "/auth") {
            navigate("/");
        }
    }, [currentUser, navigate, setCurrentUser, location]);

    return useRoutes([
        { path: "/", element: <DashBoard /> },
        { path: "/auth", element: <Login /> },
        { path: "/signup", element: <Signup /> },
        { path: "/profile", element: <User /> },
    ]);
};


export default ProjectRoutes;