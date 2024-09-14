const { User } = require('../models/user.model')
const bcrypt = require('bcryptjs')

const registerUser = async ({ email, password }) => {
  try {
    const user = new User({ email, password })
    await user.save()
    return user
  } catch (error) {
    if (error.code === 11000) {
      // Custom error for duplicate email
      throw new Error(
        'Duplicate Email: The email address is already registered.'
      )
    } else {
      // General error
      throw new Error(`Couldn't register user: ${error.message}`)
    }
  }
}

const loginUser = async ({ email, password }) => {
  try {
    const response = await User.findOne({ email: email })

    const checkPassword = await bcrypt.compare(password, response.password)

    return checkPassword && response.isVerified === true ? response : undefined
  } catch (error) {
    throw new Error("Couldn't find user", error)
  }
}

const verifyUser = async email => {
  try {
    const response = await User.findOne({ email })
    return response
  } catch (error) {
    throw new Error("Couldn't find user", error)
  }
}

module.exports = {
  registerUser,
  loginUser,
  verifyUser
}
