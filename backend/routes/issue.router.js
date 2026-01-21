import express from 'express';

const issueRouter = express.Router();

issueRouter.get("/issues/create/", ()=>{
    console.log("console log test")
})
issueRouter.put("/issues/update/:id", ()=>{
    console.log("console log test")
})
issueRouter.delete("/issues/delete/:id", ()=>{
    console.log("console log test")
})
issueRouter.get("/issues/:id", ()=>{
    console.log("console log test")
})
issueRouter.get("/issues/", ()=>{
    console.log("console log test")
});

export default issueRouter;