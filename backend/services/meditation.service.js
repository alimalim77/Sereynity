const { MeditationSession } = require("../models/meditationSession.model");
const { Details } = require("../models/details.model");
const mongoose = require("mongoose");

const updateMeditationStats = async (userId, sessionData) => {
  const session = await MeditationSession.create({
    userId,
    ...sessionData,
  });

  // Update user's total meditation minutes
  await Details.findOneAndUpdate(
    { userId },
    {
      $inc: {
        totalMeditationMinutes: Math.floor(sessionData.duration / 60),
      },
      $set: {
        lastMeditationDate: new Date(),
      },
    }
  );

  return session;
};

const getAnalytics = async (userId) => {
  const analytics = await MeditationSession.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$meditationType",
        totalSessions: { $sum: 1 },
        totalMinutes: { $sum: { $divide: ["$duration", 60] } },
        averageDuration: { $avg: "$duration" },
      },
    },
  ]);

  return analytics;
};

const getMeditationSessions = async (userId) => {
  try {
    const sessions = await MeditationSession.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ createdAt: -1 })
      .limit(5);
    return sessions;
  } catch (error) {
    console.error("Meditation Service Error:", error);
    throw new Error("Error fetching meditation sessions");
  }
};

module.exports = {
  updateMeditationStats,
  getAnalytics,
  getMeditationSessions,
};
