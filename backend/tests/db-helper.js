let isConnected = false;

const CONNECT_TIMEOUT_MS = 3000;

export async function connectTestDb() {
    const uri = process.env.MONGO_URI;
    if (!uri) return false;
    if (isConnected) return true;
    try {
        const mongoose = (await import("mongoose")).default;
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: CONNECT_TIMEOUT_MS,
            connectTimeoutMS: CONNECT_TIMEOUT_MS,
        });
        isConnected = true;
        return true;
    } catch {
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
