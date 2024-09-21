const userService = require('../services/auth.service')
const { sendEmail } = require('../utils/nodemail.util')
const { generateAuthenticationToken } = require('../services/token.service')

const postRegister = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userService.registerUser({
      email: email,
      password: password
    })
    const { otp, expiresAt } = await sendEmail(email)
    user.otp = otp
    user.otpExpiresAt = expiresAt
    user.save()
    res.status(201).send({ message: 'User registered successfully', user })
  } catch (error) {
    if (error.message.includes('Duplicate Email')) {
      return res.status(409).send({ message: error.message })
    }
    return res.status(500).send({ message: error.message })
  }
}

// Need to set email in localStorage to receive it here in body
// Check JWT expiration time with expiry time of token
const verifyRegister = async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await userService.verifyUser(email)
    if (!user || !user._id) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    const isOtpInvalid = user.otp !== otp
    const isOtpExpired = user.otpExpiresAt.getTime() < Date.now()
    if (isOtpInvalid || isOtpExpired) {
      return res.status(401).json({ message: 'Invalid or expired OTP' })
    }

    await verifyUser(user)
    const token = await generateAuthenticationToken(user)

    return res.status(201).json({ user, token })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await userService.loginUser({ email, password })
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Unauthorized or Invalid Credentials' })
    }
    const token = await generateAuthenticationToken(user)

    const response = extractResponse(user)
    console.log(response, user)
    return res.status(200).json({ user: response, token })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const postForgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await userService.verifyUser(email)
    if (!user || user.isVerified === undefined) {
      return res
        .status(400)
        .send({ message: 'Invalid email address or unauthorized' })
    }
    const { otp, expiresAt } = await sendEmail(email)
    const response = extractResponse(user)

    await assignDetails(user, otp, expiresAt)

    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const extractResponse = user => {
  const { password, ...userWithoutPassword } = user.toObject
    ? user.toObject()
    : user
  return userWithoutPassword
}

const verifyUser = async user => {
  user.isVerified = true
  user.otp = undefined
  user.otpExpiresAt = undefined
  await user.save()
}

const assignDetails = async (user, otp, otpExpiresAt) => {
  user.otp = otp
  user.otpExpiresAt = otpExpiresAt
  await user.save()
}

// Sending the data without password -> Need to match with previous response
const resetPassword = async (req, res) => {
  try {
    const { email, otp } = req.body
    const user = await userService.verifyUser(email)
    if (!user) {
      return res.status(400).send({ message: 'Invalid request' })
    }

    const isOtpInvalid = user.otp !== otp
    const isOtpExpired = user.otpExpiresAt.getTime() < Date.now()
    if (isOtpInvalid || isOtpExpired) {
      return res.status(401).json({ message: 'Invalid or expired OTP' })
    }
    await verifyUser(user)

    const response = extractResponse(user)
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

module.exports = {
  postRegister,
  postLogin,
  verifyRegister,
  postForgotPassword,
  resetPassword
}
