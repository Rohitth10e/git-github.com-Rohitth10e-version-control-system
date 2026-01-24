import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.SECRET_KEY;

function generateToken(email, username) {
    return jwt.sign({
        data: {
            email: email,
            username: username,
        }
    }, key, { expiresIn: '1h' });
}

function verifyToken(token) {
    return jwt.verify(token, process.env.SECRET_KEY);
}

export {verifyToken, generateToken};