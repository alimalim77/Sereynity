require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env')
})
const request = require('supertest')
const { faker } = require('@faker-js/faker')
const httpStatus = require('http-status')
const httpMocks = require('node-mocks-http')
const app = require('../index.js')
const userService = require('../services/auth.service')
const setupTestDB = require('./test.setup.js')
const { User } = require('../models/user.model.js')
const tokenService = require('../services/token.service.js')
const { userOne, insertUsers } = require('./fixtures/user.fixture')
const { userOneAccessToken } = require('./fixtures/token.fixture')
const { describe } = require('node:test')
const { sendEmail } = require('../utils/nodemail.util.js')

jest.mock('../utils/nodemail.util.js', () => ({
  sendEmail: jest.fn().mockResolvedValue({
    otp: 123456,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  })
}))

setupTestDB()

// 400 Bad Request: If the OTP is incorrect or the request is malformed.
// 401 Unauthorized: If the user isn't authenticated or authorized to verify the OTP.
// 500 Internal Server Error: If something goes wrong server-side during the process.

describe('Auth Routes', () => {
  describe('POST /v1/auth/register', () => {
    let newUser
    beforeEach(() => {
      newUser = {
        email: faker.internet.email().toLowerCase(),
        password: 'password1'
      }
    })
    test('should return 201 and successfully register user if request data is ok', async () => {
      const res = await request(app)
        .post('/v1/auth/register')
        .send(newUser)
      expect(res.status).toEqual(httpStatus.CREATED)

      expect(res.body.user).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          email: newUser.email
        })
      )

      const dbUser = await User.findById(res.body.user._id)
      expect(dbUser).toBeDefined()
      expect(dbUser.password).not.toBe(newUser.password)
      expect(dbUser).toMatchObject({
        email: newUser.email
      })

      // Expect sendEmail to be called with the newUser's email
      expect(sendEmail).toHaveBeenCalledWith(newUser.email)
    })

    test('should return 409 for duplicacy, the email address is already registered', async () => {
      // Send the first registration request
      await request(app)
        .post('/v1/auth/register')
        .send(newUser)

      // Send the second registration request with the same email (duplicate)
      const res = await request(app)
        .post('/v1/auth/register')
        .send(newUser)

      // Expect the second request to return a conflict status (409)
      expect(res.status).toBe(httpStatus.CONFLICT)
    })

    test('should return 400 for invalid request data', async () => {
      const invalidUser = {
        email: 'invalid-email', // Invalid email format
        password: 'pass' // Password too short
      }
      const res = await request(app)
        .post('/v1/auth/register')
        .send(invalidUser)
      // Expecting a 400 Bad Request due to invalid email or password
      expect(res.status).toBe(httpStatus.BAD_REQUEST)

      // Check if req.body contains the property 'error'
      expect(res.body).toHaveProperty('error')
    })

    test('should return 500 for server error during registration', async () => {
      const mockUser = jest
        .spyOn(userService, 'registerUser')
        .mockRejectedValue(new Error('Internal Server Error'))

      const res = await request(app)
        .post('/v1/auth/register')
        .send(newUser)

      // Expecting a 500 Internal Server Error due to a server-side issue
      expect(res.status).toBe(httpStatus.INTERNAL_SERVER_ERROR)

      // Check if the response contains the correct error message
      expect(res.body.message).toBe('Internal Server Error')

      mockUser.mockRestore()
    })
  })

  describe('POST /v1/auth/verify', () => {
    let newUser
    beforeEach(() => {
      newUser = {
        email: faker.internet.email().toLowerCase(),
        password: 'password1'
      }
    })

    test('should return 201 and successfully verify the OTP', async () => {
      const res = await request(app)
        .post('/v1/auth/register')
        .send(newUser)
      const mockUser = {
        email: res.body.user.email,
        otp: res.body.user.otp
      }

      // Expect sendEmail to be called with the newUser's email
      expect(sendEmail).toHaveBeenCalledWith(newUser.email)

      const verificationRes = await request(app)
        .post('/v1/auth/verify')
        .send(mockUser)

      expect(verificationRes.status).toBe(httpStatus.CREATED)

      expect(verificationRes.body.user).toEqual(
        expect.objectContaining({
          email: mockUser.email,
          isVerified: expect.any(Boolean)
        })
      )
    })

    test('should return 400 if email address is invalid', async () => {
      const res = await request(app)
        .post('/v1/auth/verify')
        .send(newUser)
      expect(res.status).toEqual(httpStatus.BAD_REQUEST)

      expect(res.body).toEqual({ message: 'Invalid request' })
    })

    test('should return 401 if OTP is expired or invalid', async () => {
      const res = await request(app)
        .post('/v1/auth/register')
        .send(newUser)
      const mockUser = {
        email: res.body.user.email,
        otp: Math.floor(100000 + Math.random() * 900000)
      }
      const verificationRes = await request(app)
        .post('/v1/auth/verify')
        .send(mockUser)
      expect(verificationRes.status).toEqual(httpStatus.UNAUTHORIZED)
    })

    test('should return 500 for server error during verification of OTP', async () => {
      const mockUser = jest
        .spyOn(userService, 'verifyUser')
        .mockRejectedValue(new Error('Internal Server Error'))

      const res = await request(app)
        .post('/v1/auth/verify')
        .send(newUser)

      // Expecting a 500 Internal Server Error due to a server-side issue
      expect(res.status).toBe(httpStatus.INTERNAL_SERVER_ERROR)

      // Check if the response contains the correct error message
      expect(res.body.message).toBe('Internal Server Error')

      mockUser.mockRestore()
    })
  })

  describe('POST /v1/auth/login', () => {
    let newUser
    beforeEach(() => {
      newUser = {
        email: faker.internet.email().toLowerCase(),
        password: 'password1'
      }
    })
    test('should return 200 if user is valid with verified email', async () => {
      const res = await request(app)
        .post('/v1/auth/register')
        .send(newUser)
      const mockUser = {
        email: res.body.user.email,
        otp: res.body.user.otp
      }

      // Expect sendEmail to be called with the newUser's email
      expect(sendEmail).toHaveBeenCalledWith(newUser.email)

      await request(app)
        .post('/v1/auth/verify')
        .send(mockUser)

      const loginRes = await request(app)
        .post('/v1/auth/login')
        .send({ email: res.body.user.email, password: newUser.password })

      expect(loginRes.status).toBe(httpStatus.OK)

      expect(loginRes.body.user).toEqual(
        expect.objectContaining({
          email: mockUser.email,
          isVerified: expect.any(Boolean)
        })
      )

      expect(loginRes.body.token).toEqual(
        expect.objectContaining({
          access: expect.anything()
        })
      )
    })

    test('should return 401 if user is unauthroized or invalid credentials', async () => {
      const res = await request(app)
        .post('/v1/auth/register')
        .send(newUser)
      const mockUser = {
        email: res.body.user.email,
        otp: res.body.user.otp
      }
      await request(app)
        .post('/v1/auth/verify')
        .send(mockUser)

      const loginRes = await request(app)
        .post('/v1/auth/login')
        .send({ email: res.body.user.email, password: '12345678' })

      expect(loginRes.status).toBe(httpStatus.UNAUTHORIZED)

      expect(loginRes.body).toEqual(
        expect.objectContaining({
          message: expect.anything()
        })
      )
    })

    test('should return 500 for server error during logging in', async () => {
      const mockUser = jest
        .spyOn(userService, 'loginUser')
        .mockRejectedValue(new Error('Internal Server Error'))
      const res = await request(app)
        .post('/v1/auth/register')
        .send(newUser)
      const mockUserData = {
        email: res.body.user.email,
        otp: res.body.user.otp
      }
      await request(app)
        .post('/v1/auth/verify')
        .send(mockUserData)

      const loginRes = await request(app)
        .post('/v1/auth/login')
        .send({ email: res.body.user.email, password: newUser.password })

      // Expecting a 500 Internal Server Error due to a server-side issue
      expect(loginRes.status).toBe(httpStatus.INTERNAL_SERVER_ERROR)

      // Check if the response contains the correct error message
      expect(loginRes.body.message).toBe('Internal Server Error')

      mockUser.mockRestore()
    })
  })

  describe('POST /v1/auth/forgot-password', () => {
    let newUser
    beforeEach(() => {
      newUser = {
        email: faker.internet.email().toLowerCase(),
        password: 'password1'
      }
    })
    describe('POST /v1/auth/forgot-password', () => {
      test('should return 200 on successfully sending the change password request', async () => {
        const res = await request(app)
          .post('/v1/auth/register')
          .send(newUser)
        const mockUser = {
          email: res.body.user.email,
          otp: res.body.user.otp
        }

        // Expect sendEmail to be called with the newUser's email
        expect(sendEmail).toHaveBeenCalledWith(newUser.email)

        const verificationRes = await request(app)
          .post('/v1/auth/verify')
          .send(mockUser)
        expect(verificationRes.status).toBe(httpStatus.CREATED)

        const changePasswordRes = await request(app)
          .post('/v1/auth/forgot-password')
          .send(newUser)
        console.log('Body is', changePasswordRes.body)
        expect(changePasswordRes.status).toBe(httpStatus.OK)
      })

      test('should return 400 if OTP is not verified using POST /verify request', async () => {
        const res = await request(app)
          .post('/v1/auth/register')
          .send(newUser)

        const changePasswordRes = await request(app)
          .post('/v1/auth/forgot-password')
          .send(newUser)
        console.log(changePasswordRes.body)
        expect(changePasswordRes.status).toBe(httpStatus.BAD_REQUEST)
      })

      test('should return 400 if mail is not correct', async () => {
        const res = await request(app)
          .post('/v1/auth/register')
          .send(newUser)
        const mockUser = {
          email: res.body.user.email,
          otp: res.body.user.otp
        }
        const verificationRes = await request(app)
          .post('/v1/auth/verify')
          .send(mockUser)
        expect(verificationRes.status).toBe(httpStatus.CREATED)

        const changePasswordRes = await request(app)
          .post('/v1/auth/forgot-password')
          .send({ ...newUser, email: 'liam@gmail.com' })

        expect(changePasswordRes.status).toBe(httpStatus.BAD_REQUEST)
      })

      test('should return 500 for server error during OTP generation for reset', async () => {
        const mockUser = jest
          .spyOn(userService, 'verifyUser')
          .mockRejectedValue(new Error('Internal Server Error'))

        const res = await request(app)
          .post('/v1/auth/verify')
          .send(newUser)

        // Expecting a 500 Internal Server Error due to a server-side issue
        expect(res.status).toBe(httpStatus.INTERNAL_SERVER_ERROR)

        // Check if the response contains the correct error message
        expect(res.body.message).toBe('Internal Server Error')

        mockUser.mockRestore()
      })
    })
  })
})
