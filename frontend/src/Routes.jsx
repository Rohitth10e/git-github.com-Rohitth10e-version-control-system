import {useNavigate, useRoutes} from 'react-router-dom';

import {Dahboard} from "./Components/dashboard/Dashboard.jsx";
import {Login} from "./Components/Login/Login.jsx";
import {Signup} from "./Components/Signup/Signup.jsx";

import {useAuth} from "./AuthContext.jsx";
import {useEffect} from "react";

const ProjectRoutes = () => {
    const {currentUser, setCurrentUser} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const userIdFromStorage = localStorage.getItem("userId");
        if(userIdFromStorage && !currentUser) {
            setCurrentUser(userIdFromStorage);
        }

        if(!userIdFromStorage && !["/auth","/signup"].includes(window.location.pathname)) {
            navigate("/auth");
        }
        if(userIdFromStorage && window.location.pathname == "/auth") {
            navigate("/dashboard");
        }
    },[currentUser, navigate, setCurrentUser]);

    let elements = useRoutes([
        {
            path: "/",
            element:<Dahboard />
        },
        {
            path: "/signup",
            element:<Signup />
        },
        {
            path: "/login",
            element:<Login />
        },
    ])

    return elements;
}

export default ProjectRoutes;