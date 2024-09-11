require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const request = require("supertest");
const { faker } = require("@faker-js/faker");
const httpStatus = require("http-status");
const httpMocks = require("node-mocks-http");
const app = require("../index.js");
const tokenService = require("../services/token.service.js");
const setupTestDB = require("./test.setup.js");
const { User } = require("../models/user.model.js");
const { userOne, insertUsers } = require("./fixtures/user.fixture");
const { userOneAccessToken } = require("./fixtures/token.fixture");

setupTestDB();

describe("Auth Routes", () => {
  describe("POST /v1/auth/register", () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        email: faker.internet.email().toLowerCase(),
        password: "password1",
      };
    });
    test("should return 201 and successfully register user if request data is ok", async () => {
      const res = await request(app).post("/v1/auth/register").send(newUser);
      console.log(res.statusCode, res.body);
      expect(res.status).toEqual(httpStatus.CREATED);

      expect(res.body.user).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          email: newUser.email,
        })
      );

      const dbUser = await User.findById(res.body.user._id);
      expect(dbUser).toBeDefined();
      expect(dbUser.password).not.toBe(newUser.password);
      expect(dbUser).toMatchObject({
        email: newUser.email,
      });

      // Part of OTP Registration Verification
      // expect(res.body.tokens).toEqual({
      //   access: { token: expect.anything(), expires: expect.anything() },
      // });
    }, 60000);
  });
});
