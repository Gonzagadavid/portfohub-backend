import { MongoClient } from "mongodb";
import { describe, expect, it, jest, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import MongoClientMock from "../utils/MongoClientMock.js";
import RouterRoot from "../../src/routes/RouterRoot.js";
import App from "../../src/app/App.js";

describe("Post /users/login", () => {
  let connectionMock = null;
  let app = null;
  beforeAll(async () => {
    connectionMock = await MongoClientMock();
    MongoClient.connect = jest.fn().mockResolvedValueOnce(connectionMock);

    const db = await connectionMock.db("porthub");
    const router = new RouterRoot(db);
    app = new App(router).app;
    await router.userRouter.collection.deleteMany({});

    const req = request(app);
    await req.post("/users/register").send({
      fullName: "usuario1",
      email: "usuario1@email.com",
      password: "123456"
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("Should fail to invalid email", async () => {
    const req = request(app);
    const response = await req.post("/users/login").send({
      email: "usuario1email.com",
      password: "123456"
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("invalid email format");
  });

  it("Should fail to request without email", async () => {
    const req = request(app);
    const response = await req.post("/users/login").send({
      password: "123456"
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Field email is required");
  });

  it("Should fail to request without password", async () => {
    const req = await request(app);
    const response = await req.post("/users/login").send({
      email: "usuario1email.com"
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Field password is required");
  });

  it("Should fail to request to unregistered user", async () => {
    const req = request(app);
    const response = await req.post("/users/login").send({
      email: "semregistro@email.com",
      password: "123456"
    });
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("E-mail or password incorrect");
  });

  it("Should success with valid user", async () => {
    const req = request(app);
    const response = await req.post("/users/login").send({
      email: "usuario1@email.com",
      password: "123456"
    });
    expect(response.statusCode).toBe(202);
    expect(response.body).toHaveProperty("accessToken");
  });
});
