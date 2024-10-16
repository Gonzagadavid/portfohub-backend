import { MongoClient } from "mongodb";
import { describe, expect, it, jest, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import MongoClientMock from "../utils/MongoClientMock.js";
import RouterRoot from "../../src/routes/RouterRoot.js";
import App from "../../src/app/App.js";

describe("/academic", () => {
  let connectionMock = null;
  let app = null;
  let Authorization = null;
  beforeAll(async () => {
    connectionMock = await MongoClientMock();
    MongoClient.connect = jest.fn().mockResolvedValueOnce(connectionMock);

    const db = await connectionMock.db("porthub");
    const router = new RouterRoot(db);
    app = new App(router).app;
    await router.personalDataRouter.collection.deleteMany({});

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
      const response = await req.post("/academic").send([
        {
          institution: "UNIVESP",
          degree: "engenharia da computação",
          startDate: "2022-06-10",
          endDate: "2026-06-10"
        },
        {
          institution: "UNICAMP",
          degree: "pós graduação",
          startDate: "2026-06-10",
          endDate: "2028-06-10"
        }
      ]);
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not authenticated");
    });

    it("Should fail to body without institution in items", async () => {
      const req = request(app);
      const response = await req
        .post("/academic")
        .set({ Authorization })
        .send([
          {
            degree: "engenharia da computação",
            startDate: "2022-06-10",
            endDate: "2026-06-10"
          },
          {
            degree: "pós graduação",
            startDate: "2026-06-10",
            endDate: "2028-06-10"
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field institution is required");
    });

    it("Should fail to body without institution in one item", async () => {
      const req = request(app);
      const response = await req
        .post("/academic")
        .set({ Authorization })
        .send([
          {
            institution: "UNIVESP",
            degree: "engenharia da computação",
            startDate: "2022-06-10",
            endDate: "2026-06-10"
          },
          {
            degree: "pós graduação",
            startDate: "2026-06-10",
            endDate: "2028-06-10"
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field institution is required");
    });

    it("Should fail to body without degree in items", async () => {
      const req = request(app);
      const response = await req
        .post("/academic")
        .set({ Authorization })
        .send([
          {
            institution: "UNIVESP",
            startDate: "2022-06-10",
            endDate: "2026-06-10"
          },
          {
            institution: "UNICAMP",
            startDate: "2026-06-10",
            endDate: "2028-06-10"
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field degree is required");
    });

    it("Should fail to body without degree in one item", async () => {
      const req = request(app);
      const response = await req
        .post("/academic")
        .set({ Authorization })
        .send([
          {
            institution: "UNIVESP",
            degree: "engenharia da computação",
            startDate: "2022-06-10",
            endDate: "2026-06-10"
          },
          {
            institution: "UNICAMP",
            startDate: "2026-06-10",
            endDate: "2028-06-10"
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field degree is required");
    });

    it("Should fail to body without startDate in items", async () => {
      const req = request(app);
      const response = await req
        .post("/academic")
        .set({ Authorization })
        .send([
          {
            institution: "UNIVESP",
            degree: "engenharia da computação",
            endDate: "2026-06-10"
          },
          {
            institution: "UNICAMP",
            degree: "pós graduação",
            endDate: "2028-06-10"
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field startDate is required");
    });

    it("Should fail to body without startDate in one item", async () => {
      const req = request(app);
      const response = await req
        .post("/academic")
        .set({ Authorization })
        .send([
          {
            institution: "UNIVESP",
            degree: "engenharia da computação",
            endDate: "2026-06-10"
          },
          {
            institution: "UNICAMP",
            degree: "pós graduação",
            startDate: "2026-06-10",
            endDate: "2028-06-10"
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field startDate is required");
    });

    it("Should success to registered academic data", async () => {
      const req = request(app);
      const response = await req
        .post("/academic")
        .set({ Authorization })
        .send([
          {
            institution: "UNIVESP",
            degree: "engenharia da computação",
            startDate: "2022-06-10",
            endDate: "2026-06-10"
          },
          {
            institution: "UNICAMP",
            degree: "pós graduação",
            startDate: "2026-06-10",
            endDate: "2028-06-10"
          }
        ]);
      expect(response.statusCode).toBe(201);
    });
  });

  describe("GET", () => {
    it("Should fail to not authenticated", async () => {
      const req = request(app);
      const response = await req.get("/academic");
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not authenticated");
    });

    it("Should success to return academic data", async () => {
      const req = request(app);
      const response = await req.get("/academic").set({ Authorization });
      expect(response.statusCode).toBe(200);

      expect(response.body.info).toEqual([
        {
          institution: "UNIVESP",
          degree: "engenharia da computação",
          startDate: "2022-06-10",
          endDate: "2026-06-10"
        },
        {
          institution: "UNICAMP",
          degree: "pós graduação",
          startDate: "2026-06-10",
          endDate: "2028-06-10"
        }
      ]);
    });
  });

  describe("PUT", () => {
    it("Should fail to not authenticated", async () => {
      const req = request(app);
      const response = await req.put("/academic").send([
        {
          institution: "UNIVESP updated",
          degree: "engenharia da computação updated",
          startDate: "2022-06-10 updated",
          endDate: "2026-06-10 updated"
        },
        {
          institution: "UNICAMP updated",
          degree: "pós graduação updated",
          startDate: "2026-06-10 updated",
          endDate: "2028-06-10 updated"
        }
      ]);
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not authenticated");
    });

    it("Should fail to body without institution", async () => {
      const req = request(app);
      const response = await req
        .put("/academic")
        .set({ Authorization })
        .send([
          {
            degree: "engenharia da computação updated",
            startDate: "2022-06-10 updated",
            endDate: "2026-06-10 updated"
          },
          {
            institution: "UNICAMP updated",
            degree: "pós graduação updated",
            startDate: "2026-06-10 updated",
            endDate: "2028-06-10 updated"
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field institution is required");
    });
    it("Should fail to body without degree", async () => {
      const req = request(app);
      const response = await req
        .put("/academic")
        .set({ Authorization })
        .send([
          {
            institution: "UNIVESP updated",
            startDate: "2022-06-10 updated",
            endDate: "2026-06-10 updated"
          },
          {
            institution: "UNICAMP updated",
            degree: "pós graduação updated",
            startDate: "2026-06-10 updated",
            endDate: "2028-06-10 updated"
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field degree is required");
    });

    it("Should fail to body without startDate", async () => {
      const req = request(app);
      const response = await req
        .put("/academic")
        .set({ Authorization })
        .send([
          {
            institution: "UNIVESP updated",
            degree: "engenharia da computação updated",
            endDate: "2026-06-10 updated"
          },
          {
            institution: "UNICAMP updated",
            degree: "pós graduação updated",
            startDate: "2026-06-10 updated",
            endDate: "2028-06-10 updated"
          }
        ]);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field startDate is required");
    });

    it("Should success to update academic data", async () => {
      const req = request(app);
      const response = await req
        .put("/academic")
        .set({ Authorization })
        .send([
          {
            institution: "UNIVESP updated",
            degree: "engenharia da computação updated",
            startDate: "2022-06-10 updated",
            endDate: "2026-06-10 updated"
          },
          {
            institution: "UNICAMP updated",
            degree: "pós graduação updated",
            startDate: "2026-06-10 updated",
            endDate: "2028-06-10 updated"
          }
        ]);
      expect(response.statusCode).toBe(202);

      const getResponse = await req.get("/academic").set({ Authorization });

      expect(getResponse.statusCode).toBe(200);
      expect(getResponse.body.info).toEqual([
        {
          institution: "UNIVESP updated",
          degree: "engenharia da computação updated",
          startDate: "2022-06-10 updated",
          endDate: "2026-06-10 updated"
        },
        {
          institution: "UNICAMP updated",
          degree: "pós graduação updated",
          startDate: "2026-06-10 updated",
          endDate: "2028-06-10 updated"
        }
      ]);
    });
  });
});
