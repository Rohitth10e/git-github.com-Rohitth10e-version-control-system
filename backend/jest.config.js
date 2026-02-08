export default {
    testEnvironment: "node",
    transform: {},
    moduleNameMapper: {},
    testMatch: ["**/tests/**/*.test.js"],
    setupFilesAfterEnv: ["./tests/setup.js"],
    testTimeout: 15000,
};
