import express from 'express';
import {
    deleteUserProfile,
    getAllUsers,
    getUserProfile,
    loginController,
    registerController,
    updateUserProfile
} from "../controller/user.controller.js";
import {authenticateUser} from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/users/register", registerController);
userRouter.post("/users/login", loginController);
userRouter.get("/users/allusers", getAllUsers);
userRouter.get("/users/profile/:id", getUserProfile);
userRouter.put("/users/profile/update/:id", authenticateUser ,updateUserProfile);
userRouter.delete("/users/delete/:id", authenticateUser ,deleteUserProfile);

export default userRouter;