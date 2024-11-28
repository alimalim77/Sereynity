const router = require("express").Router();
const authRouter = require("./auth.route");
const detailsRouter = require("./details.route");
const meditationRouter = require("./meditation.route");

router.use("/auth", authRouter);
router.use("/details", detailsRouter);
router.use("/meditation", meditationRouter);

module.exports = router;
