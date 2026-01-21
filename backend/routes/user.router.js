import express from 'express';

const userRouter = express.Router();

userRouter.post("/users/register", (req, res) => {
    console.log("User registration endpoint hit");
    res.send("User registered");
});
userRouter.post("/users/login", (req, res) => {
    console.log("User login endpoint hit");
    res.send("User logged in");
});
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