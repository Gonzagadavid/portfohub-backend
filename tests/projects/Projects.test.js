import { MongoClient } from "mongodb";
import { describe, expect, it, jest, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import MongoClientMock from "../utils/MongoClientMock.js";
import RouterRoot from "../../src/routes/RouterRoot.js";
import App from "../../src/app/App.js";

describe("/projects", () => {
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
      const response = await req.post("/projects").send([
        {
          projectName: "Calendar",
          link: "http://project",
          description: "api de calendario",
          icons: []
        }
      ]);
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not authenticated");
    });

    it("Should fail to create a empty list", async () => {
      const req = request(app);
      const response = await req
        .post("/projects")
        .set({ Authorization })
        .send([]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Is required min length 1 to list");
    });

    it("Should fail to create a projects list without projectName", async () => {
      const req = request(app);
      const response = await req
        .post("/projects")
        .set({ Authorization })
        .send([
          {
            link: "http://project",
            description: "api de calendario",
            icons: []
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field projectName is required");
    });

    it("Should fail to create a projects list without link", async () => {
      const req = request(app);
      const response = await req
        .post("/projects")
        .set({ Authorization })
        .send([
          {
            projectName: "Calendar",
            description: "api de calendario",
            icons: []
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field link is required");
    });

    it("Should fail to create a projects list without description", async () => {
      const req = request(app);
      const response = await req
        .post("/projects")
        .set({ Authorization })
        .send([
          {
            projectName: "Calendar",
            link: "http://project",
            icons: []
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field description is required");
    });

    it("Should success to create a projects list", async () => {
      const req = request(app);
      const response = await req
        .post("/projects")
        .set({ Authorization })
        .send([
          {
            projectName: "Calendar",
            link: "http://project",
            description: "api de calendario",
            icons: []
          }
        ]);
      expect(response.statusCode).toBe(201);
    });
  });

  describe("GET", () => {
    it("Should fail to not authenticated", async () => {
      const req = request(app);
      const response = await req.get("/projects");
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not authenticated");
    });

    it("Should success to return projects list", async () => {
      const req = request(app);
      const response = await req.get("/projects").set({ Authorization });
      expect(response.statusCode).toBe(200);
      expect(response.body.info).toEqual([
        {
          projectName: "Calendar",
          link: "http://project",
          description: "api de calendario",
          icons: []
        }
      ]);
    });
  });

  describe("PUT", () => {
    it("Should fail to not authenticated", async () => {
      const req = request(app);
      const response = await req.put("/projects").send([
        {
          projectName: "Calendar",
          link: "http://project",
          description: "api de calendario",
          icons: []
        },
        {
          projectName: "Sudoku",
          link: "http://project",
          description: "api de calendario",
          icons: []
        }
      ]);
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not authenticated");
    });

    it("Should fail to update a empty list", async () => {
      const req = request(app);
      const response = await req
        .put("/projects")
        .set({ Authorization })
        .send([]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Is required min length 1 to list");
    });

    it("Should fail to update a projects list without projectName", async () => {
      const req = request(app);
      const response = await req
        .put("/projects")
        .set({ Authorization })
        .send([
          {
            link: "http://project",
            description: "api de calendario",
            icons: []
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field projectName is required");
    });

    it("Should fail to update a projects list without link", async () => {
      const req = request(app);
      const response = await req
        .put("/projects")
        .set({ Authorization })
        .send([
          {
            projectName: "Calendar",
            description: "api de calendario",
            icons: []
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field link is required");
    });

    it("Should fail to update a projects list without description", async () => {
      const req = request(app);
      const response = await req
        .put("/projects")
        .set({ Authorization })
        .send([
          {
            projectName: "Calendar",
            link: "http://project",
            icons: []
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field description is required");
    });

    it("Should success to update a projects list", async () => {
      const req = request(app);
      const response = await req
        .put("/projects")
        .set({ Authorization })
        .send([
          {
            projectName: "Calendar",
            link: "http://project",
            description: "api de calendario",
            icons: []
          },
          {
            projectName: "Sudoku",
            link: "http://project",
            description: "api de calendario",
            icons: []
          }
        ]);
      expect(response.statusCode).toBe(202);
      expect(response.body.info).toEqual([
        {
          projectName: "Calendar",
          link: "http://project",
          description: "api de calendario",
          icons: []
        },
        {
          projectName: "Sudoku",
          link: "http://project",
          description: "api de calendario",
          icons: []
        }
      ]);
    });
  });
});
