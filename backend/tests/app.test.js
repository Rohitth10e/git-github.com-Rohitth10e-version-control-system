import request from "supertest";
import { app } from "../index.js";

describe("GET /", () => {
    it("should return Server is healthy!", async () => {
        const res = await request(app).get("/");

        expect(res.statusCode).toBe(200);
        expect(res.text).toBe("Server is healthy");
    });
});

// describe("API v1 routes", () =>{
//     it("Should respond from v1 routes", async () => {
//         const res = await request(app).get("/api/v1");
//
//         expect(res.statusCode).toBe(200);
//     });
// })