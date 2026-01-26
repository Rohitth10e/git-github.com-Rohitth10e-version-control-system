import bcrypt from "bcrypt";

async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

async function comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
}

export { hashPassword, comparePassword };
