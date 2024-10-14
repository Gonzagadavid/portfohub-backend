import { MongoClient } from "mongodb";
import { describe, expect, it, jest, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import MongoClientMock from "../utils/MongoClientMock.js";
import RouterRoot from "../../src/routes/RouterRoot.js";
import App from "../../src/app/App.js";

describe("Post /users/register", () => {
  let connectionMock = null;
  let app = null;
  beforeAll(async () => {
    connectionMock = await MongoClientMock();
    MongoClient.connect = jest.fn().mockResolvedValueOnce(connectionMock);

    const db = await connectionMock.db("porthub");
    const router = new RouterRoot(db);
    app = new App(router).app;
    await router.userRouter.collection.deleteMany({});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("Should fail to request without fullName", async () => {
    const req = request(app);
    const response = await req.post("/users/register").send({
      email: "usuario1@email.com",
      password: "123456"
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Field fullName is required");
  });

  it("Should fail to request without password", async () => {
    const req = request(app);
    const response = await req.post("/users/register").send({
      name: "usuario1",
      fullName: "dos Testes",
      email: "usuario1@email.com"
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Field password is required");
  });

  it("Should success to created valid user", async () => {
    const req = request(app);
    const response = await req.post("/users/register").send({
      name: "usuario1",
      fullName: "dos Testes",
      email: "usuario1@email.com",
      password: "123456"
    });
    expect(response.statusCode).toBe(201);
  });

  it("Should fail to email already registered", async () => {
    const req = request(app);
    const response = await req.post("/users/register").send({
      name: "usuario1",
      fullName: "dos Testes",
      email: "usuario1@email.com",
      password: "123456"
    });
    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "User usuario1@email.com already registered"
    );
  });
});
