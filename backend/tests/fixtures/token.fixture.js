require('dotenv').config({
  path: require('path').resolve(__dirname, '../../.env')
})
const { tokenTypes } = require('../../config/tokens')
const tokenService = require('../../services/token.service')
const { userOne, userTwo } = require('./user.fixture')

const accessTokenExpires =
  Math.floor(Date.now() / 1000) + process.env.JWT_ACCESS_EXPIRATION_MINUTES * 60

const userOneAccessToken = tokenService.generateAuthenticationToken(
  userOne._id,
  accessTokenExpires,
  tokenTypes.ACCESS
)

const userTwoAccessToken = tokenService.generateAuthenticationToken(
  userTwo._id,
  accessTokenExpires,
  tokenTypes.ACCESS
)

module.exports = {
  userOneAccessToken,
  userTwoAccessToken
}
