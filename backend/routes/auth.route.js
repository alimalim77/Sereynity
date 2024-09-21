const app = require("express").Router();
const { userValidation } = require("../middlewares/auth.validate");
const {
  postRegister,
  postLogin,
  verifyRegister,
  postForgotPassword,
  resetPassword,
  confirmPassword,
} = require("../controllers/auth.controller");

app.get("/auth", (req, res) => {
  console.log("Auth Test");
});

app.post("/auth/register", userValidation.body, postRegister);
app.post("/auth/verify", verifyRegister);

app.post("/auth/login", userValidation.body, postLogin);

app.post("/auth/forgot-password", postForgotPassword);
app.post("/auth/reset-password", resetPassword);
app.post("/auth/confirm-password", confirmPassword);

module.exports = app;
