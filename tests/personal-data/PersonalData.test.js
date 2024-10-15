import { MongoClient } from "mongodb";
import { describe, expect, it, jest, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import MongoClientMock from "../utils/MongoClientMock.js";
import RouterRoot from "../../src/routes/RouterRoot.js";
import App from "../../src/app/App.js";

describe("/personal-data", () => {
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
      const response = await req.post("/personal-data").send({
        fullName: "Tomas shelby",
        address: { city: "Gothan", state: "SP" },
        description: "Eu sou o cara do teste",
        network: {
          github: "https://github",
          linkedin: "https://linkedin",
          instagram: "https://instagram",
          whatsapp: "+55(11)99856254"
        },
        email: "teste@email.com",
        phrase:
          "o teste não garante uma aplicação sem bug, mas bugs são pegos por testes"
      });
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not authenticated");
    });

    it("Should fail to invalid email", async () => {
      const req = request(app);
      const response = await req
        .post("/personal-data")
        .set({ Authorization })
        .send({
          fullName: "Tomas shelby",
          address: { city: "Gothan", state: "SP" },
          description: "Eu sou o cara do teste",
          network: {
            github: "https://github",
            linkedin: "https://linkedin",
            instagram: "https://instagram",
            whatsapp: "+55(11)99856254"
          },
          email: "testeemail.com",
          phrase:
            "o teste não garante uma aplicação sem bug, mas bugs são pegos por testes"
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("invalid email format");
    });

    it("Should fail to body without email", async () => {
      const req = request(app);
      const response = await req
        .post("/personal-data")
        .set({ Authorization })
        .send({
          fullName: "Tomas shelby",
          address: { city: "Gothan", state: "SP" },
          description: "Eu sou o cara do teste",
          network: {
            github: "https://github",
            linkedin: "https://linkedin",
            instagram: "https://instagram",
            whatsapp: "+55(11)99856254"
          },
          phrase:
            "o teste não garante uma aplicação sem bug, mas bugs são pegos por testes"
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field email is required");
    });
    it("Should fail to body without fullName", async () => {
      const req = request(app);
      const response = await req
        .post("/personal-data")
        .set({ Authorization })
        .send({
          address: { city: "Gothan", state: "SP" },
          description: "Eu sou o cara do teste",
          network: {
            github: "https://github",
            linkedin: "https://linkedin",
            instagram: "https://instagram",
            whatsapp: "+55(11)99856254"
          },
          email: "teste@email.com",
          phrase:
            "o teste não garante uma aplicação sem bug, mas bugs são pegos por testes"
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field fullName is required");
    });

    it("Should fail to body without address", async () => {
      const req = request(app);
      const response = await req
        .post("/personal-data")
        .set({ Authorization })
        .send({
          fullName: "Tomas shelby",
          description: "Eu sou o cara do teste",
          network: {
            github: "https://github",
            linkedin: "https://linkedin",
            instagram: "https://instagram",
            whatsapp: "+55(11)99856254"
          },
          email: "teste@email.com",
          phrase:
            "o teste não garante uma aplicação sem bug, mas bugs são pegos por testes"
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field address is required");
    });

    it("Should fail to body without description", async () => {
      const req = request(app);
      const response = await req
        .post("/personal-data")
        .set({ Authorization })
        .send({
          fullName: "Tomas shelby",
          address: { city: "Gothan", state: "SP" },
          network: {
            github: "https://github",
            linkedin: "https://linkedin",
            instagram: "https://instagram",
            whatsapp: "+55(11)99856254"
          },
          email: "teste@email.com",
          phrase:
            "o teste não garante uma aplicação sem bug, mas bugs são pegos por testes"
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field description is required");
    });

    it("Should success to registered personal data", async () => {
      const req = request(app);
      const response = await req
        .post("/personal-data")
        .set({ Authorization })
        .send({
          fullName: "Tomas shelby",
          address: { city: "Gothan", state: "SP" },
          description: "Eu sou o cara do teste",
          network: {
            github: "https://github",
            linkedin: "https://linkedin",
            instagram: "https://instagram",
            whatsapp: "+55(11)99856254"
          },
          email: "teste@email.comm",
          phrase:
            "o teste não garante uma aplicação sem bug, mas bugs são pegos por testes"
        });
      expect(response.statusCode).toBe(201);
    });
  });

  describe("GET", () => {
    it("Should fail to not authenticated", async () => {
      const req = request(app);
      const response = await req.get("/personal-data");
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not authenticated");
    });

    it("Should success to return personal data", async () => {
      const req = request(app);
      const response = await req.get("/personal-data").set({ Authorization });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        _id: expect.any(String),
        userId: expect.any(String),
        fullName: "Tomas shelby",
        address: { city: "Gothan", state: "SP" },
        description: "Eu sou o cara do teste",
        network: {
          github: "https://github",
          linkedin: "https://linkedin",
          instagram: "https://instagram",
          whatsapp: "+55(11)99856254"
        },
        email: "teste@email.comm",
        phrase:
          "o teste não garante uma aplicação sem bug, mas bugs são pegos por testes"
      });
    });
  });

  describe("PUT", () => {
    it("Should fail to not authenticated", async () => {
      const req = request(app);
      const response = await req.put("/personal-data").send({
        fullName: "Tomas shelby updated",
        address: { city: "Gothan updated", state: "SP updated" },
        description: "Eu sou o cara do teste updated",
        network: {
          github: "https://githubupdated",
          linkedin: "https://linkedinupdated",
          instagram: "https://instagramupdated",
          whatsapp: "+55(11)99999999"
        },
        email: "testeupdated@email.comm",
        phrase:
          "o teste não garante uma aplicação sem bug, mas bugs são pegos por testes(updated)"
      });
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not authenticated");
    });

    it("Should fail to invalid email", async () => {
      const req = request(app);
      const response = await req
        .put("/personal-data")
        .set({ Authorization })
        .send({
          fullName: "Tomas shelby updated",
          address: { city: "Gothan updated", state: "SP updated" },
          description: "Eu sou o cara do teste updated",
          network: {
            github: "https://githubupdated",
            linkedin: "https://linkedinupdated",
            instagram: "https://instagramupdated",
            whatsapp: "+55(11)99999999"
          },
          email: "testeupdatedemail.comm",
          phrase:
            "o teste não garante uma aplicação sem bug, mas bugs são pegos por testes(updated)"
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("invalid email format");
    });

    it("Should fail to body without email", async () => {
      const req = request(app);
      const response = await req
        .put("/personal-data")
        .set({ Authorization })
        .send({
          fullName: "Tomas shelby updated",
          address: { city: "Gothan updated", state: "SP updated" },
          description: "Eu sou o cara do teste updated",
          network: {
            github: "https://githubupdated",
            linkedin: "https://linkedinupdated",
            instagram: "https://instagramupdated",
            whatsapp: "+55(11)99999999"
          },
          phrase:
            "o teste não garante uma aplicação sem bug, mas bugs são pegos por testes(updated)"
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field email is required");
    });
    it("Should fail to body without fullName", async () => {
      const req = request(app);
      const response = await req
        .put("/personal-data")
        .set({ Authorization })
        .send({
          address: { city: "Gothan updated", state: "SP updated" },
          description: "Eu sou o cara do teste updated",
          network: {
            github: "https://githubupdated",
            linkedin: "https://linkedinupdated",
            instagram: "https://instagramupdated",
            whatsapp: "+55(11)99999999"
          },
          email: "testeupdated@email.comm",
          phrase:
            "o teste não garante uma aplicação sem bug, mas bugs são pegos por testes(updated)"
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field fullName is required");
    });

    it("Should fail to body without address", async () => {
      const req = request(app);
      const response = await req
        .put("/personal-data")
        .set({ Authorization })
        .send({
          fullName: "Tomas shelby updated",
          description: "Eu sou o cara do teste updated",
          network: {
            github: "https://githubupdated",
            linkedin: "https://linkedinupdated",
            instagram: "https://instagramupdated",
            whatsapp: "+55(11)99999999"
          },
          email: "testeupdated@email.comm",
          phrase:
            "o teste não garante uma aplicação sem bug, mas bugs são pegos por testes(updated)"
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field address is required");
    });

    it("Should fail to body without description", async () => {
      const req = request(app);
      const response = await req
        .put("/personal-data")
        .set({ Authorization })
        .send({
          fullName: "Tomas shelby updated",
          address: { city: "Gothan updated", state: "SP updated" },
          network: {
            github: "https://githubupdated",
            linkedin: "https://linkedinupdated",
            instagram: "https://instagramupdated",
            whatsapp: "+55(11)99999999"
          },
          email: "testeupdated@email.comm",
          phrase:
            "o teste não garante uma aplicação sem bug, mas bugs são pegos por testes(updated)"
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Field description is required");
    });

    it("Should success to update personal data", async () => {
      const req = request(app);
      const response = await req
        .put("/personal-data")
        .set({ Authorization })
        .send({
          fullName: "Tomas shelby updated",
          address: { city: "Gothan updated", state: "SP updated" },
          description: "Eu sou o cara do teste updated",
          network: {
            github: "https://githubupdated",
            linkedin: "https://linkedinupdated",
            instagram: "https://instagramupdated",
            whatsapp: "+55(11)99999999"
          },
          email: "testeupdated@email.comm",
          phrase:
            "o teste não garante uma aplicação sem bug, mas bugs são pegos por testes(updated)"
        });
      expect(response.statusCode).toBe(202);

      const getResponse = await req
        .get("/personal-data")
        .set({ Authorization });

      expect(getResponse.statusCode).toBe(200);
      expect(getResponse.body).toEqual({
        _id: expect.any(String),
        userId: expect.any(String),
        fullName: "Tomas shelby updated",
        address: { city: "Gothan updated", state: "SP updated" },
        description: "Eu sou o cara do teste updated",
        network: {
          github: "https://githubupdated",
          linkedin: "https://linkedinupdated",
          instagram: "https://instagramupdated",
          whatsapp: "+55(11)99999999"
        },
        email: "testeupdated@email.comm",
        phrase:
          "o teste não garante uma aplicação sem bug, mas bugs são pegos por testes(updated)"
      });
    });
  });
});
