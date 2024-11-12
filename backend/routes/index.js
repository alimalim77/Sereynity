const router = require("express").Router();
const authRouter = require("./auth.route");
const detailsRouter = require("./details.route");

router.use("/auth", authRouter);
router.use("/details", detailsRouter);

module.exports = router;
