const express = require("express");
const router = express.Router();
const {
  getSessions,
  createSession,
} = require("../controllers/meditation.controller");

router.get("/sessions", getSessions);
router.post("/sessions", createSession);

module.exports = router;
