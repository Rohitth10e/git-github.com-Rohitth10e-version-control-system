import express from 'express';

const repoRouter = express.Router();

repoRouter.get("/repo/create/", ()=>{
    console.log("console log test")
})
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