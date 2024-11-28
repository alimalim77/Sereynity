const mongoose = require("mongoose");

const meditationSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    duration: {
      type: Number, // in seconds
      required: true,
    },
    meditationType: {
      type: String,
      enum: [
        "mindfulness",
        "breathing",
        "loving-kindness",
        "body-scan",
        "zen",
        "guided",
        "g-test",
      ],
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    isCompleted: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const MeditationSession = mongoose.model(
  "MeditationSession",
  meditationSessionSchema
);
module.exports = { MeditationSession };
