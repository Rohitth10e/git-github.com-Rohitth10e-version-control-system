import bcrypt from 'bcrypt';

function hashPassword(password){
    const hashed = bcrypt.hash(password, 10);
    return hashed;
}

function comparePassword(hashedPassword, password){
    return bcrypt.compare(password, hashedPassword);
}

export {hashPassword , comparePassword};