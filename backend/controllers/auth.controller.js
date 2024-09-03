const userService = require("../services/auth.service");

const postRegister = async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await userService.registerUser({
      email: email,
      password: password,
    });
    res.status(201).send(response);
  } catch (error) {
    throw error;
  }
};

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await userService.loginUser({
      email: email,
      password: password,
    });
    if (response.length > 0) {
      res.status(201).send(response);
    } else {
      res.status(401).send({ response: response, message: "Unauthorized" });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  postRegister,
  postLogin,
};
