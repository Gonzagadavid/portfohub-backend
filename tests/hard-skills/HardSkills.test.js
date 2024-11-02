import { MongoClient } from "mongodb";
import { describe, expect, it, jest, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import MongoClientMock from "../utils/MongoClientMock.js";
import RouterRoot from "../../src/routes/RouterRoot.js";
import App from "../../src/app/App.js";

describe("/hard-skills", () => {
  let connectionMock = null;
  let app = null;
  let Authorization = null;
  beforeAll(async () => {
    connectionMock = await MongoClientMock();
    MongoClient.connect = jest.fn().mockResolvedValueOnce(connectionMock);

    const db = await connectionMock.db("porthub");
    const router = new RouterRoot(db);
    app = new App(router).app;
    await router.hardSkillsRouter.collection.deleteMany({});

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
        .post("/hard-skills")
        .send(["Javascript", "Jest"]);
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not authenticated");
    });

    it("Should fail to create a empty list", async () => {
      const req = request(app);
      const response = await req
        .post("/hard-skills")
        .set({ Authorization })
        .send([]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Is required min length 1 to list");
    });

    it("Should success to create a hard skills list", async () => {
      const req = request(app);
      const response = await req
        .post("/hard-skills")
        .set({ Authorization })
        .send(["Javascript", "Jest"]);
      expect(response.statusCode).toBe(201);
    });
  });

  describe("GET", () => {
    it("Should fail to not authenticated", async () => {
      const req = request(app);
      const response = await req.get("/hard-skills");
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not authenticated");
    });

    it("Should success to return hard skills list", async () => {
      const req = request(app);
      const response = await req.get("/hard-skills").set({ Authorization });
      expect(response.statusCode).toBe(200);
      expect(response.body.info).toEqual(["Javascript", "Jest"]);
    });
  });

  describe("GET", () => {
    it("Should fail to not authenticated", async () => {
      const req = request(app);
      const response = await req
        .put("/hard-skills")
        .send(["Javascript", "Jest", "Empatia"]);
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not authenticated");
    });

    it("Should fail to update a empty list", async () => {
      const req = request(app);
      const response = await req
        .put("/hard-skills")
        .set({ Authorization })
        .send([]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Is required min length 1 to list");
    });

    it("Should success to update a hard skills list", async () => {
      const req = request(app);
      const response = await req
        .put("/hard-skills")
        .set({ Authorization })
        .send(["Javascript", "Jest", "Express"]);
      expect(response.statusCode).toBe(202);
      expect(response.body.info).toEqual(["Javascript", "Jest", "Express"]);
    });
  });
});
