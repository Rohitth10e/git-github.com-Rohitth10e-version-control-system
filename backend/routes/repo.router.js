import express from "express";

import {
    createRepo,
    fetchRepoForCurrentUser,
    getAllRepos,
    getRepoById,
    getRepoByName,
    updateRepoById,
    deleteRepoById,
    toggleRepoVisibilityById,
} from "../controller/repo.controller.js";

import { authenticateUser } from "../middleware/auth.js";

const repoRouter = express.Router();

repoRouter.post("/repo/create", authenticateUser, createRepo);

repoRouter.get("/repo/getall", getAllRepos);
repoRouter.get("/repo/user/:id", authenticateUser, fetchRepoForCurrentUser);

repoRouter.get("/repo/name/:name", getRepoByName);
repoRouter.get("/repo/:id", getRepoById);

repoRouter.put("/repo/update/:id", authenticateUser, updateRepoById);
repoRouter.patch("/repo/toggle/:id", authenticateUser, toggleRepoVisibilityById);

repoRouter.delete("/repo/delete/:id", authenticateUser, deleteRepoById);

export default repoRouter;