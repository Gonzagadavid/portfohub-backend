import { MongoClient } from "mongodb";
import { describe, expect, it, jest, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import MongoClientMock from "../utils/MongoClientMock.js";
import RouterRoot from "../../src/routes/RouterRoot.js";
import App from "../../src/app/App.js";

describe("/portfolio", () => {
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
  describe("/requirements", () => {
    it("Return all requirements as false when none requirements filled", async ()=> {
      const req = request(app);
      const response = await req.get("/portfolio/requirements").set({ Authorization });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual( {
        checkInfo: {
          template: false,
          pathname: false,
          professional: false,
          personalData: false,
          softSkills: false,
          hardSkills: false,
          academic: false,
          projects: false
        }
      });
    });

    it("Return professional true when filled", async ()=> {
      const req = request(app);
      const responseProfessional = await req
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
      expect(responseProfessional.statusCode).toBe(201);

      const response = await req.get("/portfolio/requirements").set({ Authorization });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual( {
        checkInfo: {
          template: false,
          pathname: false,
          professional: true,
          personalData: false,
          softSkills: false,
          hardSkills: false,
          academic: false,
          projects: false
        }
      });
    });

    it("Return personal data true when filled", async ()=> {
      const req = request(app);
      const responsePersonalData = await req
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
      expect(responsePersonalData.statusCode).toBe(201);

      const response = await req.get("/portfolio/requirements").set({ Authorization });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual( {
        checkInfo: {
          template: false,
          pathname: false,
          professional: true,
          personalData: true,
          softSkills: false,
          hardSkills: false,
          academic: false,
          projects: false
        }
      });
    });

    it("Return soft skills true when filled", async ()=> {
      const req = request(app);
      const responseSoftSkills = await req
        .post("/soft-skills")
        .set({ Authorization })
        .send(["Comunicação", "Liderança"]);
      expect(responseSoftSkills.statusCode).toBe(201);

      const response = await req.get("/portfolio/requirements").set({ Authorization });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual( {
        checkInfo: {
          template: false,
          pathname: false,
          professional: true,
          personalData: true,
          softSkills: true,
          hardSkills: false,
          academic: false,
          projects: false
        }
      });
    });

    it("Return hard skills true when filled", async ()=> {
      const req = request(app);
      const responseHardSkills = await req
        .post("/hard-skills")
        .set({ Authorization })
        .send(["Javascript", "Jest"]);
      expect(responseHardSkills.statusCode).toBe(201);

      const response = await req.get("/portfolio/requirements").set({ Authorization });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual( {
        checkInfo: {
          template: false,
          pathname: false,
          professional: true,
          personalData: true,
          softSkills: true,
          hardSkills: true,
          academic: false,
          projects: false
        }
      });
    });

    it("Return academic when filled", async ()=> {
      const req = request(app);
      const responseAcademic = await req
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
      expect(responseAcademic.statusCode).toBe(201);

      const response = await req.get("/portfolio/requirements").set({ Authorization });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual( {
        checkInfo: {
          template: false,
          pathname: false,
          professional: true,
          personalData: true,
          softSkills: true,
          hardSkills: true,
          academic: true,
          projects: false
        }
      });
    });

    it("Return projects academic when filled", async ()=> {
      const req = request(app);
      const responseProjects = await req
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
      expect(responseProjects.statusCode).toBe(201);

      const response = await req.get("/portfolio/requirements").set({ Authorization });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual( {
        checkInfo: {
          template: false,
          pathname: false,
          professional: true,
          personalData: true,
          softSkills: true,
          hardSkills: true,
          academic: true,
          projects: true
        }
      });
    });

    it("Return projects pathname when filled", async ()=> {
      const req = request(app);
      const responsePathname = await req
        .post("/portfolio/pathname")
        .set({ Authorization })
        .send({pathname: "shelby"});
      expect(responsePathname.statusCode).toBe(201);

      const response = await req.get("/portfolio/requirements").set({ Authorization });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual( {
        checkInfo: {
          template: false,
          pathname: true,
          professional: true,
          personalData: true,
          softSkills: true,
          hardSkills: true,
          academic: true,
          projects: true
        }
      });
    });

    it("Return projects template when filled", async ()=> {
      const req = request(app);
      const responseTemplate = await req
        .put("/portfolio/template")
        .set({ Authorization })
        .send({template: "blackLabel"});
      expect(responseTemplate.statusCode).toBe(201);

      const response = await req.get("/portfolio/requirements").set({ Authorization });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual( {
        checkInfo: {
          template: true,
          pathname: true,
          professional: true,
          personalData: true,
          softSkills: true,
          hardSkills: true,
          academic: true,
          projects: true
        }
      });
    });
  });

  describe("/data/:pathname", () => {
    it("Should success for public route info", async () => {
      const req = request(app);
      const response = await req
        .get("/portfolio/data/shelby");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        portfolio: {
          template: "blackLabel",
          professional: [
            {
              company: "Hughes Incord",
              role: "Ea ut voluptas nisi ",
              description: "Quidem ut quae non m",
              startDate: "$D2023-09-11T03:00:00.000Z",
              endDate: "$D2023-09-11T03:00:00.000Z"
            }
          ],
          personalData: {
            fullName: "Tomas shelby",
            address: {
              city: "Gothan",
              state: "SP"
            },
            description: "Eu sou o cara do teste",
            network: {
              github: "https://github",
              linkedin: "https://linkedin",
              instagram: "https://instagram",
              whatsapp: "+55(11)99856254"
            },
            email: "teste@email.comm",
            phrase: "o teste não garante uma aplicação sem bug, mas bugs são pegos por testes"
          },
          softSkills: [
            "Comunicação",
            "Liderança"
          ],
          hardSkills: [
            "Javascript",
            "Jest"
          ],
          academic: [
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
          ],
          projects: [
            {
              projectName: "Calendar",
              link: "http://project",
              description: "api de calendario",
              icons: []
            }
          ]
        }
      });
    })
  });

  describe("/portfolio-data", () => {
    it("Should success for authenticated route info", async () => {
      const req = request(app);
      const response = await req
      .get("/portfolio/portfolio-data")
      .set({ Authorization })

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        portfolio: {
          template: "blackLabel",
          professional: [
            {
              company: "Hughes Incord",
              role: "Ea ut voluptas nisi ",
              description: "Quidem ut quae non m",
              startDate: "$D2023-09-11T03:00:00.000Z",
              endDate: "$D2023-09-11T03:00:00.000Z"
            }
          ],
          personalData: {
            fullName: "Tomas shelby",
            address: {
              city: "Gothan",
              state: "SP"
            },
            description: "Eu sou o cara do teste",
            network: {
              github: "https://github",
              linkedin: "https://linkedin",
              instagram: "https://instagram",
              whatsapp: "+55(11)99856254"
            },
            email: "teste@email.comm",
            phrase: "o teste não garante uma aplicação sem bug, mas bugs são pegos por testes"
          },
          softSkills: [
            "Comunicação",
            "Liderança"
          ],
          hardSkills: [
            "Javascript",
            "Jest"
          ],
          academic: [
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
          ],
          projects: [
            {
              projectName: "Calendar",
              link: "http://project",
              description: "api de calendario",
              icons: []
            }
          ]
        }
      });
    })

    it('Should head return status 401 to pathname used', async () => {
      const req = request(app);
      const responsePathname = await req
      .head("/portfolio/pathname-is-used/shelby")
    expect(responsePathname.statusCode).toBe(409);
    })
 
    it('Should head return status 200 to pathname not used', async () => {
      const req = request(app);
      const responsePathname = await req
      .head("/portfolio/pathname-is-used/other")
    expect(responsePathname.statusCode).toBe(200);
    })

    it("Should fail to create pathname already registered", async ()=> {
      const req = request(app);
      const responsePathname = await req
        .post("/portfolio/pathname")
        .set({ Authorization })
        .send({pathname: "shelby"});
      expect(responsePathname.statusCode).toBe(409);

      expect(responsePathname.body).toEqual({message: 'Pathname already registered to this user'});

    })

    it('Should success get pathname', async () => {
      const req = request(app);
      const responsePathname = await req
      .get("/portfolio/pathname")
      .set({ Authorization })
    expect(responsePathname.statusCode).toBe(200);
    expect(responsePathname.body.pathname).toBe('shelby')
    })
  });

  describe("/info", () => {
    it("Should success for authenticated route info", async () => {
      const req = request(app);
      const response = await req
      .get("/portfolio/info")
      .set({ Authorization })

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        portfolioInfo: {
          _id: expect.any(String),
          userId: expect.any(String),
          pathname: "shelby",
          template: "blackLabel"
        }
      });
    })
  });
});

