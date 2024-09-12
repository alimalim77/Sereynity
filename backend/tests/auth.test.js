require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const request = require("supertest");
const { faker } = require("@faker-js/faker");
const httpStatus = require("http-status");
const httpMocks = require("node-mocks-http");
const app = require("../index.js");
const userService = require("../services/auth.service");
const setupTestDB = require("./test.setup.js");
const { User } = require("../models/user.model.js");
const tokenService = require("../services/token.service.js");
const { userOne, insertUsers } = require("./fixtures/user.fixture");
const { userOneAccessToken } = require("./fixtures/token.fixture");

jest.mock("../utils/nodemail.util.js", () => ({
  sendEmail: jest.fn().mockResolvedValue({
    otp: 123456,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  }),
}));

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

      // Expect sendEmail to be called with the newUser's email
      const { sendEmail } = require("../utils/nodemail.util.js");
      expect(sendEmail).toHaveBeenCalledWith(newUser.email);

      // Part of OTP Registration Verification
      // expect(res.body.tokens).toEqual({
      //   access: { token: expect.anything(), expires: expect.anything() },
      // });
    }, 8000);

    test("should return 409 for duplicacy, the email address is already registered", async () => {
      // Send the first registration request
      await request(app).post("/v1/auth/register").send(newUser);

      // Send the second registration request with the same email (duplicate)
      const res = await request(app).post("/v1/auth/register").send(newUser);

      // Expect the second request to return a conflict status (409)
      expect(res.status).toBe(httpStatus.CONFLICT);
    });

    test("should return 400 for invalid request data", async () => {
      let invalidUser = {
        email: "invalid-email", // Invalid email format
        password: "pass", // Password too short
      };
      const res = await request(app)
        .post("/v1/auth/register")
        .send(invalidUser);
      // Expecting a 400 Bad Request due to invalid email or password
      expect(res.status).toBe(httpStatus.BAD_REQUEST);

      // Check if req.body contains the property 'error'
      expect(res.body).toHaveProperty("error");
    });

    test("should return 500 for server error during registration", async () => {
      const mockUser = jest
        .spyOn(userService, "registerUser")
        .mockRejectedValue(new Error("Internal Server Error"));

      const res = await request(app).post("/v1/auth/register").send(newUser);

      // Expecting a 500 Internal Server Error due to a server-side issue
      expect(res.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);

      // Check if the response contains the correct error message
      expect(res.body.message).toBe("Internal Server Error");

      mockUser.mockRestore();
    });
  });
});
