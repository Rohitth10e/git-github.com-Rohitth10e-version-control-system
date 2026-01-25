import express from 'express';
import {loginController, registerController} from "../controller/user.controller.js";

const userRouter = express.Router();

userRouter.post("/users/register", registerController);
userRouter.post("/users/login", loginController);
userRouter.get("/users/profile/:id", (req, res) => {
    console.log("User profile endpoint hit");
    res.send(`User profile for ID: ${req.params.id}`);
});
userRouter.put("/users/profile/update/:id", (req, res) => {
    console.log("User profile update endpoint hit");
    res.send(`User profile updated for ID: ${req.params.id}`);
});
userRouter.delete("/users/delete/:id", (req, res) => {
    console.log("User deletion endpoint hit");
    res.send(`User deleted with ID: ${req.params.id}`);
});

export default userRouter;