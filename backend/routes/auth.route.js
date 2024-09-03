const app = require("express").Router();
const { userValidation } = require("../middlewares/auth.validate");
const { postRegister, postLogin } = require("../controllers/auth.controller");

app.get("/auth", (req, res) => {
  console.log("Auth Test");
});

app.post("/auth/register", userValidation.body, postRegister);

app.post("/auth/login", userValidation.body, postLogin);

module.exports = app;
