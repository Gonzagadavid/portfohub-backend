import { MongoClient } from "mongodb";
import { describe, expect, it, jest, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import MongoClientMock from "../utils/MongoClientMock.js";
import RouterRoot from "../../src/routes/RouterRoot.js";
import App from "../../src/app/App.js";

describe("/soft-skills", () => {
  let connectionMock = null;
  let app = null;
  let Authorization = null;
  beforeAll(async () => {
    connectionMock = await MongoClientMock();
    MongoClient.connect = jest.fn().mockResolvedValueOnce(connectionMock);

    const db = await connectionMock.db("porthub");
    const router = new RouterRoot(db);
    app = new App(router).app;
    await router.softSkillsRouter.collection.deleteMany({});

    const req = request(app);
    await req.post("/users/register").send({
      fullName: "Tomas shelby",
      email: "tester@email.com",
      password: "123456"
    });
    const response = await req.post("/users/login").send({
      fullName: "Tomas shelby",
      email: "tester@email.com",
      password: "123456"
    });

    Authorization = response.body.accessToken;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("POST", () => {
    it("Should fail to not authenticated", async () => {
      const req = request(app);
      const response = await req
        .post("/soft-skills")
        .send(["Comunicação", "Liderança"]);
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not authenticated");
    });

    it("Should fail to create a empty list", async () => {
      const req = request(app);
      const response = await req
        .post("/soft-skills")
        .set({ Authorization })
        .send([]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Is required min length 1 to list");
    });

    it("Should success to create a soft skills list", async () => {
      const req = request(app);
      const response = await req
        .post("/soft-skills")
        .set({ Authorization })
        .send(["Comunicação", "Liderança"]);
      expect(response.statusCode).toBe(201);
    });
  });

  describe("GET", () => {
    it("Should fail to not authenticated", async () => {
      const req = request(app);
      const response = await req.get("/soft-skills");
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not authenticated");
    });

    it("Should success to return soft skills list", async () => {
      const req = request(app);
      const response = await req.get("/soft-skills").set({ Authorization });
      expect(response.statusCode).toBe(200);
      expect(response.body.info).toEqual(["Comunicação", "Liderança"]);
    });
  });

  describe("GET", () => {
    it("Should fail to not authenticated", async () => {
      const req = request(app);
      const response = await req
        .put("/soft-skills")
        .send(["Comunicação", "Liderança", "Empatia"]);
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not authenticated");
    });

    it("Should fail to update a empty list", async () => {
      const req = request(app);
      const response = await req
        .put("/soft-skills")
        .set({ Authorization })
        .send([]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Is required min length 1 to list");
    });

    it("Should success to update a soft skills list", async () => {
      const req = request(app);
      const response = await req
        .put("/soft-skills")
        .set({ Authorization })
        .send(["Comunicação", "Liderança", "Empatia"]);
      expect(response.statusCode).toBe(202);
      expect(response.body.info).toEqual([
        "Comunicação",
        "Liderança",
        "Empatia"
      ]);
    });
  });
});
