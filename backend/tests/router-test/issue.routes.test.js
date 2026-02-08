import request from "supertest";
import { app } from "../../index.js";
import { connectTestDb, disconnectTestDb } from "../db-helper.js";

describe("Issue routes", () => {
    let authToken;
    let testRepoId;
    let dbAvailable = false;

    beforeAll(async () => {
        dbAvailable = await connectTestDb();
        if (!dbAvailable) return;

        const email = `issue-test-${Date.now()}@test.com`;
        const username = `issuetestuser${Date.now()}`;
        await request(app)
            .post("/api/v1/users/register")
            .set("Content-Type", "application/json")
            .send({
                email,
                username,
                password: "password123",
            });
        const loginRes = await request(app)
            .post("/api/v1/users/login")
            .set("Content-Type", "application/json")
            .send({ email, password: "password123" });
        if (!loginRes.body.token) return;
        authToken = loginRes.body.token;

        const createRepoRes = await request(app)
            .post("/api/v1/repo/create")
            .set("Authorization", `Bearer ${authToken}`)
            .set("Content-Type", "application/json")
            .send({
                owner: loginRes.body.user.id,
                name: `issue-repo-${Date.now()}`,
                visibility: true,
            });
        if (createRepoRes.body.repositoryID) {
            testRepoId = createRepoRes.body.repositoryID;
        }
    }, 10000);

    afterAll(async () => {
        await disconnectTestDb();
    });

    describe("POST /api/v1/issue/create", () => {
        it("should return 401 without Authorization", async () => {
            const repoId = testRepoId || "507f1f77bcf86cd799439011";
            const res = await request(app)
                .post("/api/v1/issue/create")
                .set("Content-Type", "application/json")
                .send({
                    title: "Bug",
                    description: "Fix it",
                    repository: repoId,
                });
            expect(res.statusCode).toBe(401);
        });

        it("should return 400 for invalid repository id", async () => {
            if (!dbAvailable || !authToken) return;
            const res = await request(app)
                .post("/api/v1/issue/create")
                .set("Authorization", `Bearer ${authToken}`)
                .set("Content-Type", "application/json")
                .send({
                    title: "Bug",
                    description: "Fix it",
                    repository: "invalid",
                });
            expect(res.statusCode).toBe(400);
        });

        it("should return 201 and create issue when valid", async () => {
            if (!dbAvailable || !authToken || !testRepoId) return;
            const res = await request(app)
                .post("/api/v1/issue/create")
                .set("Authorization", `Bearer ${authToken}`)
                .set("Content-Type", "application/json")
                .send({
                    title: `Issue ${Date.now()}`,
                    description: "Test issue",
                    repository: String(testRepoId),
                });
            expect(res.statusCode).toBe(201);
            expect(res.body.message).toMatch(/created/i);
            expect(res.body.issue).toBeDefined();
            expect(res.body.issue.title).toBeDefined();
            expect(res.body.issue.status).toBeDefined();
        });
    });

    describe("GET /api/v1/issue/repo/:repoId", () => {
        it("should return 401 without token", async () => {
            const id = testRepoId || "507f1f77bcf86cd799439011";
            const res = await request(app).get(`/api/v1/issue/repo/${id}`);
            expect(res.statusCode).toBe(401);
        });

        it("should return 400 for invalid repo id", async () => {
            if (!dbAvailable || !authToken) return;
            const res = await request(app)
                .get("/api/v1/issue/repo/invalid")
                .set("Authorization", `Bearer ${authToken}`);
            expect(res.statusCode).toBe(400);
        });

        it("should return 200 and issues array", async () => {
            if (!dbAvailable || !authToken || !testRepoId) return;
            const res = await request(app)
                .get(`/api/v1/issue/repo/${testRepoId}`)
                .set("Authorization", `Bearer ${authToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.issues).toBeDefined();
            expect(Array.isArray(res.body.issues)).toBe(true);
        });
    });

    describe("PATCH /api/v1/issue/status/:id (toggle)", () => {
        let issueId;

        beforeAll(async () => {
            if (!authToken || !testRepoId) return;
            const createRes = await request(app)
                .post("/api/v1/issue/create")
                .set("Authorization", `Bearer ${authToken}`)
                .set("Content-Type", "application/json")
                .send({
                    title: "Toggle test",
                    description: "Desc",
                    repository: String(testRepoId),
                });
            if (createRes.body.issue?._id) issueId = createRes.body.issue._id;
        });

        it("should return 401 without token", async () => {
            if (!dbAvailable || !issueId) return;
            const res = await request(app).patch(`/api/v1/issue/status/${issueId}`);
            expect(res.statusCode).toBe(401);
        });

        it("should return 200 and updated issue (status toggled)", async () => {
            if (!dbAvailable || !authToken || !issueId) return;
            const res = await request(app)
                .patch(`/api/v1/issue/status/${issueId}`)
                .set("Authorization", `Bearer ${authToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.issue).toBeDefined();
            expect(["open", "in progress", "closed"]).toContain(res.body.issue.status);
        });
    });
});
