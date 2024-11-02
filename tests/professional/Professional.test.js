import { MongoClient } from "mongodb";
import { describe, expect, it, jest, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import MongoClientMock from "../utils/MongoClientMock.js";
import RouterRoot from "../../src/routes/RouterRoot.js";
import App from "../../src/app/App.js";

describe("/professional", () => {
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
      const response = await req.post("/professional").send([
        {
          company: "Hughes Incord",
          role: "Ea ut voluptas nisi ",
          description: "Quidem ut quae non m",
          startDate: "$D2023-09-11T03:00:00.000Z",
          endDate: "$D2023-09-11T03:00:00.000Z"
        }
      ]);
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not authenticated");
    });

    it("Should fail to create a empty list", async () => {
      const req = request(app);
      const response = await req
        .post("/professional")
        .set({ Authorization })
        .send([]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Is required min length 1 to list");
    });

    it("Should fail to create a professional list without company", async () => {
      const req = request(app);
      const response = await req
        .post("/professional")
        .set({ Authorization })
        .send([
          {
            role: "Ea ut voluptas nisi ",
            description: "Quidem ut quae non m",
            startDate: "$D2023-09-11T03:00:00.000Z",
            endDate: "$D2023-09-11T03:00:00.000Z"
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field company is required");
    });

    it("Should fail to create a professional list without description", async () => {
      const req = request(app);
      const response = await req
        .post("/professional")
        .set({ Authorization })
        .send([
          {
            company: "Hughes Incord",
            role: "Ea ut voluptas nisi ",
            startDate: "$D2023-09-11T03:00:00.000Z",
            endDate: "$D2023-09-11T03:00:00.000Z"
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field description is required");
    });

    it("Should fail to create a professional list without role", async () => {
      const req = request(app);
      const response = await req
        .post("/professional")
        .set({ Authorization })
        .send([
          {
            company: "Hughes Incord",
            description: "Quidem ut quae non m",
            startDate: "$D2023-09-11T03:00:00.000Z",
            endDate: "$D2023-09-11T03:00:00.000Z"
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field role is required");
    });

    it("Should fail to create a professional list without start date", async () => {
      const req = request(app);
      const response = await req
        .post("/professional")
        .set({ Authorization })
        .send([
          {
            company: "Hughes Incord",
            role: "Ea ut voluptas nisi ",
            description: "Quidem ut quae non m",
            endDate: "$D2023-09-11T03:00:00.000Z"
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field startDate is required");
    });

    it("Should success to create a professional list", async () => {
      const req = request(app);
      const response = await req
        .post("/professional")
        .set({ Authorization })
        .send([
          {
            company: "Hughes Incord",
            role: "Ea ut voluptas nisi ",
            description: "Quidem ut quae non m",
            startDate: "$D2023-09-11T03:00:00.000Z",
            endDate: "$D2023-09-11T03:00:00.000Z"
          }
        ]);
      expect(response.statusCode).toBe(201);
    });
  });

  describe("GET", () => {
    it("Should fail to not authenticated", async () => {
      const req = request(app);
      const response = await req.get("/professional");
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not authenticated");
    });

    it("Should success to return professional list", async () => {
      const req = request(app);
      const response = await req.get("/professional").set({ Authorization });
      expect(response.statusCode).toBe(200);
      expect(response.body.info).toEqual([
        {
          company: "Hughes Incord",
          role: "Ea ut voluptas nisi ",
          description: "Quidem ut quae non m",
          startDate: "$D2023-09-11T03:00:00.000Z",
          endDate: "$D2023-09-11T03:00:00.000Z"
        }
      ]);
    });
  });

  describe("PUT", () => {
    it("Should fail to not authenticated", async () => {
      const req = request(app);
      const response = await req.put("/professional").send([
        {
          company: "Hughes Incord",
          role: "Ea ut voluptas nisi ",
          description: "Quidem ut quae non m",
          startDate: "$D2023-09-11T03:00:00.000Z",
          endDate: "$D2023-09-11T03:00:00.000Z"
        },
        {
          company: "test 2",
          role: "Ea ut voluptas nisi ",
          description: "Quidem ut quae non m",
          startDate: "$D2023-09-11T03:00:00.000Z",
          endDate: "$D2023-09-11T03:00:00.000Z"
        }
      ]);
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not authenticated");
    });

    it("Should fail to update a empty list", async () => {
      const req = request(app);
      const response = await req
        .put("/professional")
        .set({ Authorization })
        .send([]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Is required min length 1 to list");
    });

    it("Should fail to update a professional list without company", async () => {
      const req = request(app);
      const response = await req
        .put("/professional")
        .set({ Authorization })
        .send([
          {
            role: "Ea ut voluptas nisi ",
            description: "Quidem ut quae non m",
            startDate: "$D2023-09-11T03:00:00.000Z",
            endDate: "$D2023-09-11T03:00:00.000Z"
          },
          {
            company: "test 2",
            role: "Ea ut voluptas nisi ",
            description: "Quidem ut quae non m",
            startDate: "$D2023-09-11T03:00:00.000Z",
            endDate: "$D2023-09-11T03:00:00.000Z"
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field company is required");
    });

    it("Should fail to update a professional list without description", async () => {
      const req = request(app);
      const response = await req
        .put("/professional")
        .set({ Authorization })
        .send([
          {
            company: "Hughes Incord",
            role: "Ea ut voluptas nisi ",
            startDate: "$D2023-09-11T03:00:00.000Z",
            endDate: "$D2023-09-11T03:00:00.000Z"
          },
          {
            company: "test 2",
            role: "Ea ut voluptas nisi ",
            description: "Quidem ut quae non m",
            startDate: "$D2023-09-11T03:00:00.000Z",
            endDate: "$D2023-09-11T03:00:00.000Z"
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field description is required");
    });

    it("Should fail to update a professional list without role", async () => {
      const req = request(app);
      const response = await req
        .put("/professional")
        .set({ Authorization })
        .send([
          {
            company: "Hughes Incord",
            description: "Quidem ut quae non m",
            startDate: "$D2023-09-11T03:00:00.000Z",
            endDate: "$D2023-09-11T03:00:00.000Z"
          },
          {
            company: "test 2",
            role: "Ea ut voluptas nisi ",
            description: "Quidem ut quae non m",
            startDate: "$D2023-09-11T03:00:00.000Z",
            endDate: "$D2023-09-11T03:00:00.000Z"
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field role is required");
    });

    it("Should fail to update a professional list without start date", async () => {
      const req = request(app);
      const response = await req
        .put("/professional")
        .set({ Authorization })
        .send([
          {
            company: "Hughes Incord",
            role: "Ea ut voluptas nisi ",
            description: "Quidem ut quae non m",
            endDate: "$D2023-09-11T03:00:00.000Z"
          },
          {
            company: "test 2",
            role: "Ea ut voluptas nisi ",
            description: "Quidem ut quae non m",
            startDate: "$D2023-09-11T03:00:00.000Z",
            endDate: "$D2023-09-11T03:00:00.000Z"
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field startDate is required");
    });

    it("Should success to update a professional list", async () => {
      const req = request(app);
      const response = await req
        .put("/professional")
        .set({ Authorization })
        .send([
          {
            company: "Hughes Incord",
            role: "Ea ut voluptas nisi ",
            description: "Quidem ut quae non m",
            startDate: "$D2023-09-11T03:00:00.000Z",
            endDate: "$D2023-09-11T03:00:00.000Z"
          },
          {
            company: "test 2",
            role: "Ea ut voluptas nisi ",
            description: "Quidem ut quae non m",
            startDate: "$D2023-09-11T03:00:00.000Z",
            endDate: "$D2023-09-11T03:00:00.000Z"
          }
        ]);
      expect(response.statusCode).toBe(202);
      expect(response.body.info).toEqual([
        {
          company: "Hughes Incord",
          role: "Ea ut voluptas nisi ",
          description: "Quidem ut quae non m",
          startDate: "$D2023-09-11T03:00:00.000Z",
          endDate: "$D2023-09-11T03:00:00.000Z"
        },
        {
          company: "test 2",
          role: "Ea ut voluptas nisi ",
          description: "Quidem ut quae non m",
          startDate: "$D2023-09-11T03:00:00.000Z",
          endDate: "$D2023-09-11T03:00:00.000Z"
        }
      ]);
    });
  });
});
