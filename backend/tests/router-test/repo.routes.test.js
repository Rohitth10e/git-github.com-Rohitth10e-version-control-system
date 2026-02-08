import request from "supertest";
import { app } from "../../index.js";
import { connectTestDb, disconnectTestDb } from "../db-helper.js";

describe("Repo routes", () => {
    let authToken;
    let testUserId;

    beforeAll(async () => {
        const connected = await connectTestDb();
        if (!connected) return;

        const email = `repo-test-${Date.now()}@test.com`;
        const username = `repotestuser${Date.now()}`;
        await request(app)
            .post("/api/v1/users/register")
            .set("Content-Type", "application/json")
            .send({
                email,
                username,
                password: "password123",
                repositories: [],
                followedUsers: [],
                starRepo: [],
            });
        const loginRes = await request(app)
            .post("/api/v1/users/login")
            .set("Content-Type", "application/json")
            .send({ email, password: "password123" });
        if (loginRes.body.token && loginRes.body.user?.id) {
            authToken = loginRes.body.token;
            testUserId = loginRes.body.user.id;
        }
    });

    afterAll(async () => {
        await disconnectTestDb();
    });

    describe("GET /api/v1/repo/getall", () => {
        it("should return 200 and array (no auth required)", async () => {
            const res = await request(app).get("/api/v1/repo/getall");
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe("POST /api/v1/repo/create", () => {
        it("should return 401 without Authorization header", async () => {
            const res = await request(app)
                .post("/api/v1/repo/create")
                .set("Content-Type", "application/json")
                .send({ owner: testUserId, name: "my-repo" });
            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBeDefined();
        });

        it("should return 401 with invalid token", async () => {
            const res = await request(app)
                .post("/api/v1/repo/create")
                .set("Authorization", "Bearer invalid-token")
                .set("Content-Type", "application/json")
                .send({ owner: testUserId, name: "my-repo" });
            expect(res.statusCode).toBe(401);
        });

        it("should return 400 when name is missing", async () => {
            if (!authToken || !testUserId) return;
            const res = await request(app)
                .post("/api/v1/repo/create")
                .set("Authorization", `Bearer ${authToken}`)
                .set("Content-Type", "application/json")
                .send({ owner: testUserId });
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toMatch(/name|required/i);
        });

        it("should return 400 when owner is invalid ObjectId", async () => {
            if (!authToken) return;
            const res = await request(app)
                .post("/api/v1/repo/create")
                .set("Authorization", `Bearer ${authToken}`)
                .set("Content-Type", "application/json")
                .send({ name: "my-repo", owner: "not-an-object-id" });
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBeDefined();
        });

        it("should return 201 and create repo when valid", async () => {
            if (!authToken || !testUserId) return;
            const name = `test-repo-${Date.now()}`;
            const res = await request(app)
                .post("/api/v1/repo/create")
                .set("Authorization", `Bearer ${authToken}`)
                .set("Content-Type", "application/json")
                .send({
                    owner: String(testUserId),
                    name,
                    description: "Test repo",
                    visibility: true,
                });
            expect(res.statusCode).toBe(201);
            expect(res.body.message).toMatch(/created/i);
            expect(res.body.repositoryID).toBeDefined();
        });
    });

    describe("GET /api/v1/repo/:id", () => {
        it("should return 400 for invalid id", async () => {
            const res = await request(app).get("/api/v1/repo/invalid-id");
            expect(res.statusCode).toBe(400);
        });
    });

    describe("GET /api/v1/repo/user/:id", () => {
        it("should return 401 without token", async () => {
            const id = testUserId || "507f1f77bcf86cd799439011";
            const res = await request(app).get(`/api/v1/repo/user/${id}`);
            expect(res.statusCode).toBe(401);
        });

        it("should return 200 and repo list for owner", async () => {
            if (!authToken || !testUserId) return;
            const res = await request(app)
                .get(`/api/v1/repo/user/${testUserId}`)
                .set("Authorization", `Bearer ${authToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.repo).toBeDefined();
            expect(Array.isArray(res.body.repo)).toBe(true);
        });
    });
});
