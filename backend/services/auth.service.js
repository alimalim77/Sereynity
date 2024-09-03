const { User } = require("../models/user.model");

const registerUser = async ({ email, password }) => {
  try {
    const user = new User({ email, password });
    await user.save();
    return user;
  } catch (error) {
    if (error.code === 11000) {
      // Custom error for duplicate email
      throw new Error(
        "Duplicate Email: The email address is already registered."
      );
    } else {
      // General error
      throw new Error(`Couldn't register user: ${error.message}`);
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
