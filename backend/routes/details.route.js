const router = require("express").Router();
const { getDetails } = require("../controllers/details.controller");

router.get("/get-details", getDetails);

module.exports = router;
