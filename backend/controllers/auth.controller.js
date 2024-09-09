const userService = require("../services/auth.service");
const { sendEmail } = require("../utils/nodemail.util");
const { generateAuthenticationToken } = require("../services/token.service");

const postRegister = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.registerUser({
      email: email,
      password: password,
    });
    const { otp, expiresAt } = await sendEmail(email);
    user.otp = otp;
    user.otpExpiresAt = expiresAt;
    user.save();
    res.status(201).send({ message: "User registered successfully", user });
  } catch (error) {
    if (error.message.includes("Duplicate Email")) {
      return res.status(409).send({ message: error.message });
    }
    return res.status(500).send({ message: error.message });
  }
};

// Need to set email in localStorage to receive it here in body
// Check JWT expiration time with expiry time of token
const verifyRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userService.verifyUser(email);
    if (!user || !user._id) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const isOtpInvalid = user.otp !== otp;
    const isOtpExpired = user.otpExpiresAt.getTime() < Date.now();
    if (isOtpInvalid || isOtpExpired) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    verifyUser(user);
    const token = await generateAuthenticationToken(user);

    return res.status(201).json({ user, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userService.loginUser({ email, password });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized or Invalid Credentials" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const verifyUser = (user) => {
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  user.save();
};

module.exports = {
  postRegister,
  postLogin,
  verifyRegister,
};
