const router = require("express").Router();
const { userValidation } = require("../middlewares/auth.validate");
const {
  postRegister,
  postLogin,
  verifyRegister,
  postForgotPassword,
  resetPassword,
  confirmPassword,
} = require("../controllers/auth.controller");

router.get("/", (req, res) => {
  console.log("Auth Test");
  res.status(200).json({ message: "Auth Test" });
});

router.post("/register", userValidation.body, postRegister);
router.post("/verify", verifyRegister);

router.post("/login", userValidation.body, postLogin);

router.post("/forgot-password", postForgotPassword);
router.post("/reset-password", resetPassword);
router.post("/confirm-password", confirmPassword);

module.exports = router;
