import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import Navbar from "../Navbar.jsx";

export const DashBoard = () => {
    const [repositories, setRepositories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestedRepositories, setSuggestedRepositories] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        const fetchRepositories = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(
                    `http://localhost:3000/api/v1/repo/user/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        }
                    }
                );
                const data = await response.json();
                console.log(data);
                setRepositories(data.repo);
            } catch (err) {
                console.error("Error while fecthing repositories: ", err);
            }
        };

        const fetchSuggestedRepositories = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/v1/repo/getall`);
                const data = await response.json();
                setSuggestedRepositories(data);
                console.log(suggestedRepositories);
            } catch (err) {
                console.error("Error while fecthing repositories: ", err);
            }
        };

        fetchRepositories();
        fetchSuggestedRepositories();
    }, []);

    useEffect(() => {
        if (searchQuery == "") {
            setSearchResults(repositories);
        } else {
            const filteredRepo = repositories.filter((repo) =>
                repo.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(filteredRepo);
        }
    }, [searchQuery, repositories]);

    return (
        <>
            <Navbar />
            <section id="dashboard">
                <aside>
                    <h3>Suggested Repositories</h3>
                    {suggestedRepositories.map((repo) => {
                        return (
                            <div className="repo-list" key={repo._id}>
                                <div className="repo-card">
                                    <h4>{repo.name}</h4>
                                    <p>{repo.description}</p>
                                    <Link to={`/repo/${repo._id}/issues`}>View issues</Link>
                                </div>
                            </div>
                        );
                    })}
                </aside>
                <main>
                    <h2>Your Repositories</h2>
                    <div id="search">
                    <input
                            type="text"
                            value={searchQuery}
                            placeholder="Search..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {searchResults && searchResults.map((repo) => {
                        return (
                            <div key={repo._id} className="repo-card">
                                <h4>{repo.name}</h4>
                                <p>{repo.description}</p>
                                <Link to={`/repo/${repo._id}/issues`}>View issues</Link>
                            </div>
                        );
                    })}
                </main>
                <aside>
                    <h3>Upcoming Events</h3>
                    <ul>
                        <li>
                            <p>Tech Conference - Dec 15</p>
                        </li>
                        <li>
                            <p>Developer Meetup - Dec 25</p>
                        </li>
                        <li>
                            <p>React Summit - Jan 5</p>
                        </li>
                    </ul>
                </aside>
            </section>
        </>
    );
};