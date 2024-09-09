const { tokenTypes } = require("../config/tokens");
const jwt = require("jsonwebtoken");

require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const generateToken = (
  userId,
  expires,
  type,
  secret = process.env.JWT_SECRET
) => {
  const data = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: expires,
    type: type,
  };
  const token = jwt.sign(data, secret);
  return token;
};

const generateAuthenticationToken = async (user) => {
  const tokenExpire = Math.floor(
    Date.now() / 1000 + process.env.JWT_ACCESS_EXPIRATION_MINUTES * 60
  );
  const token = generateToken(user._id, tokenExpire, tokenTypes.ACCESS);
  return {
    access: {
      token: token,
      expires: new Date(tokenExpire * 1000),
    },
  };
};

module.exports = {
  generateAuthenticationToken,
};
