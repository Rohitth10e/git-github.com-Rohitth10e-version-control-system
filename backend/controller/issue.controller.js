import mongoose from "mongoose";
import Issue from '../models/issuesmodels.js';
import Repository from "../models/repomodels.js";

export const createIssue = async (req, res) => {
    const { title, description, repository } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(repository)) {
            return res.status(400).json({ error: "Invalid repository id" });
        }

        const repo = await Repository.findById(repository);
        if (!repo) {
            return res.status(404).json({ error: "Repository not found" });
        }

        const issue = await Issue.create({
            title,
            description,
            repository,
        });

        repo.issues.push(issue._id);
        await repo.save();

        res.status(201).json({ message: "Issue created", issue });
    } catch (err) {
        res.status(500).json({ error: "Error creating issue", details: err.message });
    }
};

export const getIssueById = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid issue id" });
        }

        const issue = await Issue.findById(id).populate("repository");

        if (!issue) {
            return res.status(404).json({ error: "Issue not found" });
        }

        res.status(200).json({ issue });
    } catch (err) {
        res.status(500).json({ error: "Error fetching issue", details: err.message });
    }
};

export const getIssuesByRepo = async (req, res) => {
    const { repoId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(repoId)) {
            return res.status(400).json({ error: "Invalid repository id" });
        }

        const issues = await Issue.find({ repository: repoId });

        res.status(200).json({ issues });
    } catch (err) {
        res.status(500).json({ error: "Error fetching issues", details: err.message });
    }
};

export const updateIssueById = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid issue id" });
        }

        const issue = await Issue.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!issue) {
            return res.status(404).json({ error: "Issue not found" });
        }

        res.status(200).json({ message: "Issue updated", issue });
    } catch (err) {
        res.status(500).json({ error: "Error updating issue", details: err.message });
    }
};

export const deleteIssueById = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid issue id" });
        }

        const issue = await Issue.findByIdAndDelete(id);

        if (!issue) {
            return res.status(404).json({ error: "Issue not found" });
        }

        await Repository.findByIdAndUpdate(issue.repository, {
            $pull: { issues: issue._id },
        });

        res.status(200).json({ message: "Issue deleted" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting issue", details: err.message });
    }
};

const STATUS_FLOW = ["open", "in progress", "closed"];

export const toggleIssueStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const issue = await Issue.findById(id);
        if (!issue) {
            return res.status(404).json({ error: "Issue not found" });
        }

        const currentIndex = STATUS_FLOW.indexOf(issue.status ?? "open");
        const nextIndex = (currentIndex + 1) % STATUS_FLOW.length;
        const nextStatus = STATUS_FLOW[nextIndex];

        const updated = await Issue.findByIdAndUpdate(
            id,
            { status: nextStatus },
            { new: true }
        );

        res.status(200).json({ message: "Status updated", issue: updated });
    } catch (err) {
        res.status(500).json({ error: "Error updating status", details: err.message });
    }
};