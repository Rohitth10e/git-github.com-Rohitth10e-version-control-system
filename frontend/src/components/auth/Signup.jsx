import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext.jsx";
import { API_BASE_URL } from "../../api.js";

import { PageHeader } from "@primer/react";
import { SkeletonBox, Button } from "@primer/react";

import "./auth.css";

import logo from "../../assets/github-mark-white.svg";
import { Link } from "react-router-dom";

export const Signup = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    const { setCurrentUser } = useAuth();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const response = await axios.post(`${API_BASE_URL}/v1/users/register`, {
                email,
                password,
                username,
            });
            console.log(response.data);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.userId);
            setCurrentUser(response.data.user);

            setLoading(false);
            window.location.href="/";
        }catch(err){
            console.error(err);
            alert("Signup Failed!");
            setLoading(false);
        }
    }

    return (
        <div className="login-wrapper">
            <div className="login-logo-container">
                <img className="logo-login" src={logo} alt="Logo"/>
            </div>

            <div className="login-box-wrapper">
                <div className="login-heading">
                    <div style={{padding: "8px"}}>
                        <PageHeader>
                            <PageHeader.TitleArea variant="large">
                                <PageHeader.Title>Sign Up</PageHeader.Title>
                            </PageHeader.TitleArea>
                        </PageHeader>
                    </div>

                </div>

                <div className="login-box">
                    <div>
                        <label className="label">Username</label>
                        <input
                            autoComplete="off"
                            name="Username"
                            id="Username"
                            className="input"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label">Email address</label>
                        <input
                            autoComplete="off"
                            name="Email"
                            id="Email"
                            className="input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="div">
                        <label className="label">Password</label>
                        <input
                            autoComplete="off"
                            name="Password"
                            id="Password"
                            className="input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <Button
                        variant="primary"
                        className="login-btn"
                        disabled={loading}
                        onClick={handleSignUp}
                    >
                        { loading ? "Signing in..." : "Sign up" }
                    </Button>
                </div>

                <div className="pass-box">
                    <p>
                        Already have an account? <Link to="/auth">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;