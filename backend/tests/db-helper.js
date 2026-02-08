let isConnected = false;

export async function connectTestDb() {
    const uri = process.env.MONGO_URI;
    if (!uri) return false;
    if (isConnected) return true;
    try {
        const mongoose = (await import("mongoose")).default;
        await mongoose.connect(uri);
        isConnected = true;
        return true;
    } catch (err) {
        console.warn("Test DB connect skipped:", err.message);
        return false;
    }
}

export async function disconnectTestDb() {
    if (!isConnected) return;
    const mongoose = (await import("mongoose")).default;
    await mongoose.disconnect();
    isConnected = false;
}

export async function getAuthToken(userId, email = "test@test.com", username = "testuser") {
    const { generateToken } = await import("../utils/jwt.js");
    return generateToken(userId, email, username);
}
