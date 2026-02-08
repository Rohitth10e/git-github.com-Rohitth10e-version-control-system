import mongoose  from 'mongoose'
import Repository from "../models/repomodels.js";
import Issue from "../models/issuesmodels.js";


async function createRepo(req, res) {
    const {owner, name,  issues, content, description, visibility} = req.body;
    try{
        if(!name) {
            return res.status(400).json({error: "repository name is required"});
        }

        if(!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({error: "invalid user id"});
        }

        if (issues && !Array.isArray(issues)) {
            return res.status(400).json({ error: "issues must be an array" });
        }

        const newRepo = new Repository({
            name,
            description,
            content,
            visibility,
            owner,
            issues
        });

        await newRepo.save();

        return res.status(201).json({
            message: 'Repository created successfully',
            repositoryID : newRepo._id,
        });

    } catch(e) {
        console.log(e);
        return res.status(401).send({error: "Error creating repo"});
    }
}

async function getAllRepos(req, res) {
    try{
        const repos = await Repository.find({})
            .populate('owner','-password')
            .populate('issues');
        return res.status(200).json(repos);
    } catch(err){
        console.log(err);
        return res.status(400).send({error: "error getting all repos"});
    }
}

async function getRepoById(req, res) {
    const {id} = req.params;
    try{
        if(!id){
            return res.status(400).json({error: "id is required"});
        }
        const repo = await Repository.findById(id)
            .populate('owner','-password')
            .populate('issues')
        console.log(repo)
        return res.status(200).json({"message":"sucessfully found repo", "repo": repo});
    } catch(err){
        return res.status(400).send({error: "error getting repo"});
    }
}

async function getRepoByName(req, res) {
    const {name} = req.params;
    try{
        const repo = await Repository.find({name: name})
            .populate('owner','-password')
            .populate('issues');
        return res.status(200).json({"message":"sucessfully found repo", "repo": repo});
    } catch(err){
        return res.status(400).send({error: "error getting repo"});
    }
}

async function fetchRepoForCurrentUser(req, res) {
    const {id} = req.params;
    const user_id = req.user?.data?.id;
    try{
        if(!id){
            return res.status(400).json({error: "id is required"});
        }
        const repo = await Repository.find({ owner:id })
        if(!repo){
            return res.status(400).send({error: "repo does not exist"});
        }
        return res.status(200).json({"message":"success", "repo": repo});
    } catch(err){
        // console.error("Fetch repo error:", err);
        return res.status(400).send({error: "error getting repo"});
    }
}

export const updateRepoById = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user?.data?.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid repository id" });
        }
        const repo = await Repository.findOne({ _id: id, owner: user_id });

        if (!repo) {
            return res.status(404).json({ error: "Repository not found" });
        }

        const updatedRepo = await Repository.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            message: "Repository updated successfully",
            repo: updatedRepo,
        });

    } catch (err) {
        console.error("Update repo error:", err);
        return res.status(500).json({
            error: "Error updating repository",
            details: err.message,
        });
    }
};

export const deleteRepoById = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user?.data?.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid repository id" });
        }

        const deletedRepo = await Repository.findOneAndDelete({
            _id: id,
            owner: user_id,
        });

        if (!deletedRepo) {
            return res.status(404).json({ error: "Repository not found" });
        }

        return res.status(200).json({
            message: "Repository deleted successfully",
            repo: deletedRepo,
        });

    } catch (err) {
        console.error("Delete repo error:", err);
        return res.status(500).json({
            error: "Error deleting repository",
            details: err.message,
        });
    }
};

export const toggleRepoVisibilityById = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user?.data?.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid repository id" });
        }

        // ✅ Find repo owned by user
        const repo = await Repository.findOne({ _id: id, owner: user_id });

        if (!repo) {
            return res.status(404).json({ error: "Repository not found" });
        }

        // ✅ Toggle visibility
        repo.visibility = !repo.visibility;
        await repo.save();

        return res.status(200).json({
            message: "Repository visibility updated successfully",
            visibility: repo.visibility,
            repo,
        });

    } catch (err) {
        console.error("Toggle visibility error:", err);
        return res.status(500).json({
            error: "Error toggling visibility",
            details: err.message,
        });
    }
};

export {createRepo, getAllRepos, getRepoById, getRepoByName, fetchRepoForCurrentUser};