const { User } = require("../models/user.model");

const registerUser = async ({ email, password }) => {
  try {
    const user = new User({ email, password });
    await user.save();
    console.log(`User saved: ${user}`);
    return user;
  } catch (error) {
    if (error.code === 11000) {
      console.log("Duplicate email error");
    } else {
      throw new Error("Couldn't register user", error);
    }
  }
};

const loginUser = async ({ email, password }) => {
  try {
    console.log("Inside Login Service");
    const response = await User.find({ email: email, password: password });
    return response;
  } catch (error) {
    throw new Error("Couldn't find user", error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
