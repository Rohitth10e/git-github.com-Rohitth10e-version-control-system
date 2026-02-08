// Ensure test env and default SECRET_KEY for JWT in tests
process.env.NODE_ENV = "test";
if (!process.env.SECRET_KEY) {
    process.env.SECRET_KEY = "test-secret-key-for-jwt";
}
