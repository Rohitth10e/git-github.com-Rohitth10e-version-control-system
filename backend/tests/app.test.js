import request from "supertest";
import { app } from "../index.js";

describe("App", () => {
    describe("GET /", () => {
        it("should return 200 and Server is healthy", async () => {
            const res = await request(app).get("/");
            expect(res.statusCode).toBe(200);
            expect(res.text).toBe("Server is healthy");
        });
    });

    describe("GET /api/v1 (no route)", () => {
        it("should return 404 for unknown API path", async () => {
            const res = await request(app).get("/api/v1");
            expect(res.statusCode).toBe(404);
        });
    });
});
