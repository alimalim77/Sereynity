const { required } = require("joi");
const mongoose = require("mongoose");

const detailsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    phone: {
      type: Number,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profileImage: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer not to say"],
    },
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    preferredMeditationTime: {
      type: String, // e.g., "morning", "evening"
    },
    meditationGoals: [
      {
        type: String,
      },
    ],
    totalMeditationMinutes: {
      type: Number,
      default: 0,
    },
    streakCount: {
      type: Number,
      default: 0,
    },
    preferredMeditationTypes: [
      {
        type: String,
        enum: [
          "mindfulness",
          "breathing",
          "body-scan",
          "loving-kindness",
          "guided",
          "unguided",
        ],
      },
    ],
    notificationPreferences: {
      reminderEnabled: { type: Boolean, default: true },
      reminderTime: { type: String }, // Time in 24hr format
      emailNotifications: { type: Boolean, default: true },
    },
    lastMeditationDate: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const Details = mongoose.model("Details", detailsSchema);

module.exports = { Details };
