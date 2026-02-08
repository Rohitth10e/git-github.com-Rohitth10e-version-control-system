import request from "supertest";
import { app } from "../../index.js";
import { connectTestDb, disconnectTestDb } from "../db-helper.js";
import User from "../../models/usermodels.js";

describe("User routes", () => {
    const testEmail = `user-test-${Date.now()}@test.com`;
    const testUsername = `usertest${Date.now()}`;
    const testPassword = "password123";

    beforeAll(async () => {
        await connectTestDb();
    });

    afterAll(async () => {
        await User.deleteOne({ email: testEmail }).catch(() => {});
        await disconnectTestDb();
    });

    describe("POST /api/v1/users/register", () => {
        it("should return 400 when email or password missing", async () => {
            const res = await request(app)
                .post("/api/v1/users/register")
                .set("Content-Type", "application/json")
                .send({ email: testEmail });
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBeDefined();
        });

        it("should return 200 and create user when valid", async () => {
            const res = await request(app)
                .post("/api/v1/users/register")
                .set("Content-Type", "application/json")
                .send({
                    email: testEmail,
                    username: testUsername,
                    password: testPassword,
                });
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toMatch(/registered|success/i);
            expect(res.body.user).toBeDefined();
            expect(res.body.user.email).toBe(testEmail);
            expect(res.body.user.username).toBe(testUsername);
        });

        it("should return 200 with message when user already exists", async () => {
            const res = await request(app)
                .post("/api/v1/users/register")
                .set("Content-Type", "application/json")
                .send({
                    email: testEmail,
                    username: testUsername + "x",
                    password: testPassword,
                });
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toMatch(/already exists/i);
        });
    });

    describe("POST /api/v1/users/login", () => {
        it("should return 400 when email or password missing", async () => {
            const res = await request(app)
                .post("/api/v1/users/login")
                .set("Content-Type", "application/json")
                .send({ email: testEmail });
            expect(res.statusCode).toBe(400);
        });

        it("should return 400 when user does not exist", async () => {
            const res = await request(app)
                .post("/api/v1/users/login")
                .set("Content-Type", "application/json")
                .send({
                    email: "nonexistent@test.com",
                    password: "any",
                });
            expect(res.statusCode).toBe(400);
        });

        it("should return 200 with token when credentials valid", async () => {
            const res = await request(app)
                .post("/api/v1/users/login")
                .set("Content-Type", "application/json")
                .send({
                    email: testEmail,
                    password: testPassword,
                });
            expect(res.statusCode).toBe(200);
            expect(res.body.token).toBeDefined();
            expect(res.body.user).toBeDefined();
            expect(res.body.user.email).toBe(testEmail);
        });
    });

    describe("GET /api/v1/users/profile/:id", () => {
        let userId;

        beforeAll(async () => {
            const user = await User.findOne({ email: testEmail });
            if (user) userId = user._id;
        });

        it("should return 200 and user profile for valid id", async () => {
            if (!userId) return;
            const res = await request(app).get(`/api/v1/users/profile/${userId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.user).toBeDefined();
            expect(res.body.user.email).toBe(testEmail);
        });
    });
});
