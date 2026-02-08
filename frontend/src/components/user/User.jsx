import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../AuthContext.jsx";

export const User = () => {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({
        username: "",
        email: "",
        repositories: [],
        followers: [],
        followedUsers: [],
        starRepo: [],
    });
    const { setCurrentUser } = useAuth();

    useEffect(() => {
        const fetchUserDetails = async () => {
            const userId = localStorage.getItem("userId");

            if (userId) {
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/profile/${userId}`
                    );
                    setUserDetails(response.data.user);
                } catch (err) {
                    console.error("Cannot fetch user details: ", err);
                }
            }
        };
        fetchUserDetails();
    }, []);

    return (
        <>
            <Navbar />
            <UnderlineNav aria-label="Repository">
                <UnderlineNav.Item
                    aria-current="page"
                    icon={BookIcon}
                    sx={{
                        backgroundColor: "transparent",
                        color: "white",
                        "&:hover": {
                            textDecoration: "underline",
                            color: "white",
                        },
                    }}
                >
                    Overview
                </UnderlineNav.Item>

                <UnderlineNav.Item
                    onClick={() => navigate("/repo")}
                    icon={RepoIcon}
                    sx={{
                        backgroundColor: "transparent",
                        color: "whitesmoke",
                        "&:hover": {
                            textDecoration: "underline",
                            color: "white",
                        },
                    }}
                >
                    Starred Repositories
                </UnderlineNav.Item>
            </UnderlineNav>

            <button
                onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                    setCurrentUser(null);

                    window.location.href = "/auth";
                }}
                style={{ position: "fixed", bottom: "50px", right: "50px" }}
                id="logout"
            >
                Logout
            </button>

            <div className="profile-page-wrapper">
                <div className="user-profile-section">
                    <div className="profile-image"></div>

                    <div className="name">
                        <h3>{userDetails.username}</h3>
                    </div>


                    <button className="follow-btn">Follow</button>

                    <div className="follower">
                        <p>{userDetails.followers?.length || 10} Followers</p>
                        <p>{userDetails.followedUsers?.length || 3} Following</p>
                    </div>
                </div>

                <div className="heat-map-section">
                    {/*<h4 style={{marginBottom: "15px"}}>Recent Contributions</h4>*/}
                    <HeatMapProfile/>
                </div>
            </div>
        </>
    );
};

