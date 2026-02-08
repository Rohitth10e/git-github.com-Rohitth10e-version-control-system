import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar.jsx";
import "./repo.css";

const API_BASE = "http://localhost:3000/api/v1";

export const Repository = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState(true);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const owner = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        if (!owner || !token) {
            setError("You must be logged in to create a repository.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/repo/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    owner,
                    name: name.trim(),
                    description: description.trim() || undefined,
                    visibility,
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to create repository");
                setLoading(false);
                return;
            }

            setLoading(false);
            navigate("/");
        } catch (err) {
            setError(err.message || "Something went wrong");
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <section className="repo-create">
                <h2>Create a new repository</h2>
                <form onSubmit={handleSubmit} className="repo-form">
                    <label>
                        Repository name <span className="required">*</span>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="my-repo"
                            required
                            autoFocus
                        />
                    </label>
                    <label>
                        Description
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Short description (optional)"
                        />
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={visibility}
                            onChange={(e) => setVisibility(e.target.checked)}
                        />
                        Public (visible to others)
                    </label>
                    {error && <p className="form-error">{error}</p>}
                    <button type="submit" disabled={loading}>
                        {loading ? "Creating…" : "Create repository"}
                    </button>
                </form>
            </section>
        </>
    );
};
