const jwt = require("jsonwebtoken");
const {
  getMeditationSessions,
  updateMeditationStats,
} = require("../services/meditation.service");

const getSessions = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      return res.status(404).json({ message: "Invalid Key Error" });
    }

    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.sub;
    const sessions = await getMeditationSessions(userId);
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({
      message: "Error fetching meditation sessions",
      error: error.message,
    });
  }
};

const createSession = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.sub;

    const sessionData = {
      duration: req.body.duration,
      meditationType: req.body.meditationType,
      isCompleted: req.body.isCompleted,
    };

    const session = await updateMeditationStats(userId, sessionData);
    res.status(201).json(session);
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({
      message: "Error creating meditation session",
      error: error.message,
    });
  }
};

module.exports = {
  getSessions,
  createSession,
};
