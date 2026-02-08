import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar.jsx";
import "./repo.css";

const API_BASE = "http://localhost:3000/api/v1";

export const Issues = () => {
    const { repoId } = useParams();
    const navigate = useNavigate();
    const [issues, setIssues] = useState([]);
    const [repoName, setRepoName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!repoId) return;

        const fetchRepoAndIssues = async () => {
            setLoading(true);
            setError("");
            try {
                const [repoRes, issuesRes] = await Promise.all([
                    fetch(`${API_BASE}/repo/${repoId}`, {
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                    }),
                    fetch(`${API_BASE}/issue/repo/${repoId}`, {
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                    }),
                ]);

                const repoData = await repoRes.json();
                const issuesData = await issuesRes.json();

                if (repoRes.ok && repoData.repo) {
                    setRepoName(repoData.repo.name);
                }
                if (issuesRes.ok && issuesData.issues) {
                    setIssues(issuesData.issues);
                } else if (!issuesRes.ok) {
                    setError(issuesData.error || "Failed to load issues");
                }
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchRepoAndIssues();
    }, [repoId, token]);

    const handleCreateIssue = async (e) => {
        e.preventDefault();
        setCreateError("");
        setCreateLoading(true);

        if (!token) {
            setCreateError("You must be logged in to create an issue.");
            setCreateLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/issue/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
                    repository: repoId,
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                setCreateError(data.error || "Failed to create issue");
                setCreateLoading(false);
                return;
            }

            setIssues((prev) => [data.issue, ...prev]);
            setTitle("");
            setDescription("");
            setCreateLoading(false);
        } catch (err) {
            setCreateError(err.message || "Something went wrong");
            setCreateLoading(false);
        }
    };

    const handleToggleStatus = async (issueId) => {
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE}/issue/status/${issueId}`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok && data.issue) {
                setIssues((prev) =>
                    prev.map((i) => (i._id === issueId ? data.issue : i))
                );
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <section className="issues-page">
                    <p className="issues-loading">Loading…</p>
                </section>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <section className="issues-page">
                <header className="issues-header">
                    <button
                        type="button"
                        className="back-link"
                        onClick={() => navigate("/")}
                    >
                        ← Back
                    </button>
                    <h2>{repoName ? `${repoName} — Issues` : "Issues"}</h2>
                </header>

                {error && <p className="form-error">{error}</p>}

                <form onSubmit={handleCreateIssue} className="repo-form issues-form">
                    <h3>New issue</h3>
                    <label>
                        Title <span className="required">*</span>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Issue title"
                            required
                        />
                    </label>
                    <label>
                        Description <span className="required">*</span>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the issue"
                            required
                        />
                    </label>
                    {createError && (
                        <p className="form-error">{createError}</p>
                    )}
                    <button type="submit" disabled={createLoading}>
                        {createLoading ? "Creating…" : "Create issue"}
                    </button>
                </form>

                <div className="issues-list">
                    <h3>Issues ({issues.length})</h3>
                    {issues.length === 0 ? (
                        <p className="issues-empty">No issues yet.</p>
                    ) : (
                        <ul>
                            {issues.map((issue) => (
                                <li key={issue._id} className="issue-item">
                                    <div className="issue-main">
                                        <span
                                            className={`issue-status status-${(issue.status || "open").replace(" ", "-")}`}
                                        >
                                            {issue.status || "open"}
                                        </span>
                                        <strong>{issue.title}</strong>
                                        {token && (
                                            <button
                                                type="button"
                                                className="issue-toggle"
                                                onClick={() =>
                                                    handleToggleStatus(issue._id)
                                                }
                                            >
                                                Toggle status
                                            </button>
                                        )}
                                    </div>
                                    {issue.description && (
                                        <p className="issue-desc">
                                            {issue.description}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </>
    );
};
