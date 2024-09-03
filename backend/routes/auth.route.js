const app = require("express").Router();
const { postRegister, postLogin } = require("../controllers/auth.controller");

app.get("/auth", (req, res) => {
  console.log("Auth Test");
});

app.post("/auth/register", postRegister);

app.post("/auth/login", postLogin);

module.exports = app;
