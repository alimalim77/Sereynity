const userService = require('../services/auth.service')
const { sendEmail } = require('../utils/nodemail.util')

const postRegister = async (req, res) => {
  try {
    console.log('Email code ran successfully')
    const { email, password } = req.body
    const user = await userService.registerUser({
      email: email,
      password: password
    })
    await sendEmail(email)
    res.status(201).send({ message: 'User registered successfully', user })
  } catch (error) {
    if (error.message.includes('Duplicate Email')) {
      return res.status(409).send({ message: error.message })
    }
    return res.status(500).send({ message: error.message })
  }
}

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    const response = await userService.loginUser({
      email: email,
      password: password
    })
    if (response.length > 0) {
      res.status(200).send(response)
    } else {
      res.status(401).send({ message: 'Unauthorized or Wrong Password' })
    }
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}

module.exports = {
  postRegister,
  postLogin
}
