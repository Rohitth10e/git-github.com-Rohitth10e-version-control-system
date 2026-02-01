import mongoose  from 'mongoose'
import Repository from "../models/repomodels.js";

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

export {createRepo};