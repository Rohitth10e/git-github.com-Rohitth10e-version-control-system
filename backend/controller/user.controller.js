import User from '../models/usermodels.js';
import res from "express/lib/response.js";
import {comparePassword, hashPassword} from "../utils/bcrypt.js";
import req from "express/lib/request.js";
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

        await new User({
            email:email,
            username:username,
            password:hashedPassword,
        }).save()

        return res.status(200).json({
            message: 'User registered successfully',
            user: {
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

         const verifypass = comparePassword(password, user.password);
         if(!verifypass){
             return res.status(400).send({ error: 'Invalid credentials' });
         }

         const accessToken = generateToken(user.email, email.username);

         return res.status(200).json({
             message: 'User login successfull',
             token: accessToken,
         })
     } catch(err) {
         return res.status(500).send({ error: 'something went wrong' });
     }
}

export {registerController, loginController};