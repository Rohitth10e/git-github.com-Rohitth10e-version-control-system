import express from "express";

import {
    createIssue,
    getIssueById,
    getIssuesByRepo,
    updateIssueById,
    deleteIssueById,
    toggleIssueStatus,
} from "../controller/issue.controller.js";

import { authenticateUser } from "../middleware/auth.js";

const issueRouter = express.Router();

issueRouter.post("/issue/create", authenticateUser, createIssue);

issueRouter.get("/issue/:id", authenticateUser, getIssueById);
issueRouter.get("/issue/repo/:repoId", authenticateUser, getIssuesByRepo);

issueRouter.put("/issue/update/:id", authenticateUser, updateIssueById);
issueRouter.patch("/issue/status/:id", authenticateUser, toggleIssueStatus);

issueRouter.delete("/issue/delete/:id", authenticateUser, deleteIssueById);

export default issueRouter;