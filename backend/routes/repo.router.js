import express from 'express';
import {createRepo} from "../controller/repo.controller.js";

const repoRouter = express.Router();

repoRouter.post("/repo/create", createRepo);
repoRouter.put("/repo/update/:id", ()=>{
    console.log("console log test")
})
repoRouter.delete("/repo/delete/:id", ()=>{
    console.log("console log test")
})
repoRouter.get("/repo/:id", ()=>{
    console.log("console log test")
})
repoRouter.patch("/repo/toggle/:id", ()=>{
    console.log("console log test")
})
repoRouter.get("/repo/all/", ()=>{
    console.log("console log test")
});
repoRouter.get("/repo/search/", ()=>{
    console.log("console log test")
});
repoRouter.get("/repo/user/:userID", ()=>{
    console.log("console log test")
});

export default repoRouter;