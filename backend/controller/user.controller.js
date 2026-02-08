import User from '../models/usermodels.js';
import {comparePassword, hashPassword} from "../utils/bcrypt.js";
import {generateToken} from "../utils/jwt.js";

async function registerController(req, res){
    const { email , username, password} = req.body;

    if(!email || !username || !password){
        return res.status(400).send({ error: 'Email and password is required' });
    }

    try{
        const user = await User.findOne({ email:email });
        if(user){
            return res.status(200).send({ message: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);

        const new_user = new User({
            email:email,
            username:username,
            password:hashedPassword,
            repositories: [],
            followedUsers: [],
            starRepo: []
        })

        await new_user.save();

        return res.status(200).json({
            message: 'User registered successfully',
            user: {
                id: new_user._id,
                email:email,
                username:username,
            }
        });

    } catch(err) {
        console.log(err);
        res.status(500).send({ error: 'something went wrong' });
    }
}

async function loginController(req, res){
     const { email, password } = req.body;
     if(!email || !password){
         return res.status(400).send({ error: 'Email and password is required' });
     }

     try {

         const user = await User.findOne({ email: email });
         if(!user) {
             return res.status(400).send({ message: 'User does not exists' });
         }

         const verifypass = await comparePassword(password, user.password);
         if(!verifypass){
             return res.status(400).send({ error: 'Invalid credentials' });
         }

         const accessToken = await generateToken(user._id ,user.email, user.username);

         return res.status(200).json({
             message: 'User login successfull',
             token: accessToken,
             user: {
                 id: user._id,
                 email: user.email,
                 username:user.username,
             }
         })
     } catch(err) {
         return res.status(500).send({ error: 'something went wrong' });
     }
}

async function getAllUsers(req, res){
    try{
        const users = await User.find({}).select("-password")
        return res.status(200).json({users: users});
    } catch(err) {
        console.log(err);
        return res.status(500).json({"message":"something went wrong"});
    }
}

async function getUserProfile(req, res){
    const { id } = req.params;

    try{
        const user = await User.findOne({ _id:id });
        if(!user){
            return res.status(400).send({ error: 'User does not exists' });
        }

        return res.status(200).json({
            message: 'User profile successfull',
            user: {
                username: user.username,
                email: user.email,
                repositories: user.repositories,
                followers: user.followers,
                starRepo: user.starRepo,
                followedUsers: user.followedUsers,
            }
        })
    } catch(err) {
        return res.status(500).send({ error: 'something went wrong' });
    }
}

async function updateUserProfile(req, res){
    const { id } = req.params;
    const {email, password} = req.body;

    try {
        const user = await User.findOne({ _id:id });
        if(!user){
            return res.status(404).json({ error: "User not found" });
        }

        if (email) user.email = email.toLowerCase();
        if (password){
            user.password = await hashPassword(password);
        }

        await user.save()
        return res.status(200).json({ message: "Profile updated successfully" });

    } catch(err) {
        return res.status(500).send({ error: 'Something went wronq' });
    }
}

async function deleteUserProfile(req, res){
    const { id } = req.params;
    // const { id } = req.user?.data
    // console.log(id);
    try {
        const user = await User.findByIdAndDelete({ _id: id });
        if(!user){
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ message: "Profile deleted successfully" });

    } catch(err) {
        return res.status(500).send({ error: 'Something went wronq' });
    }
}

export {registerController, loginController, getAllUsers, getUserProfile, updateUserProfile, deleteUserProfile};