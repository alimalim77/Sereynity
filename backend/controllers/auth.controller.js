const userService = require("../services/auth.service");
const { sendEmail } = require("../utils/nodemail.util");
const { generateAuthenticationToken } = require("../services/token.service");
const jwt = require("jsonwebtoken");
const { Details } = require("../models/details.model");
const { colorfulName } = require("../utils/generate-random-name");

const postRegister = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.registerUser({
      email: email,
      password: password,
    });
    const { otp, expiresAt } = await sendEmail(email);
    await assignDetails(user, otp, expiresAt);

    const response = extractResponse(user);

    if (!response) {
      return res.status(500).send({ message: "Error processing user data" });
    }

    return res.status(201).json({ user: response });
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

    await verifyUser(user);
    const token = await generateAuthenticationToken(user);
    await assignProfile(user, user._id);

    // Fetch the updated user with populated details
    const updatedUser = await userService.findUser(user._id);
    const response = extractResponse(updatedUser);

    return res.status(201).json({ user: response, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const assignProfile = async (user, id) => {
  const details = new Details({
    userId: id,
    name: colorfulName,
  });

  const savedDetails = await details.save();

  user.details = savedDetails._id;
  await user.save();
  return savedDetails;
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
    const token = await generateAuthenticationToken(user);

    const response = extractResponse(user);

    return res.status(200).json({ user: response, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const postForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const user = await userService.verifyUser(email);
    if (!user || !user.isVerified) {
      return res
        .status(400)
        .send({ message: "Invalid email address or unauthorized" });
    }
    const { otp, expiresAt } = await sendEmail(email);
    const response = extractResponse(user);

    await assignDetails(user, otp, expiresAt);
    return res
      .status(200)
      .json({ user: { ...response, otp: otp, otpExpiresAt: expiresAt } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Sending the data without password -> Need to match with previous response
const resetPassword = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userService.verifyUser(email);
    if (!user) {
      return res.status(400).send({ message: "Invalid request" });
    }

    const isOtpInvalid = user.otp !== otp;
    const isOtpExpired = user.otpExpiresAt.getTime() < Date.now();
    if (isOtpInvalid || isOtpExpired) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }
    await verifyUser(user);
    const token = await generateAuthenticationToken(user);
    const response = extractResponse(user);

    res.cookie("token", token.access.token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      expires: new Date(token.access.expires),
    });
    return res.status(200).json({ user: response, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Test for integration verified using pre-performed function
const confirmPassword = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const authHeader = req.headers.authorization.split(" ")[1];
  if (!authHeader) {
    return res.status(401).json({ message: "Token required" });
  }

  try {
    const user = await userService.verifyUser(email);

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      return res.status(404).json({ message: "Invalid Key Error" });
    }

    const decoded = jwt.verify(authHeader, secretKey);

    const userId = decoded.sub;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password", error);
    res.status(500).json({ message: "Error updating password" });
  }
};

const extractResponse = (user) => {
  if (!user) return null;

  const userObj = user.toObject ? user.toObject() : user;
  const { password, ...userWithoutPassword } = userObj;

  return {
    _id: userObj._id,
    email: userObj.email,
    isVerified: userObj.isVerified,
    otp: userObj.otp,
    otpExpiresAt: userObj.otpExpiresAt,
    details: userObj.details,
  };
};

const verifyUser = async (user) => {
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();
};

const assignDetails = async (user, otp, otpExpiresAt) => {
  if (!user) return null;

  user.otp = otp;
  user.otpExpiresAt = otpExpiresAt;
  user.isVerified = false;
  await user.save();
  return user;
};

module.exports = {
  postRegister,
  postLogin,
  verifyRegister,
  postForgotPassword,
  resetPassword,
  confirmPassword,
};
