const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: false,
  },
  otpExpiresAt: {
    type: Date,
    required: false,
  },
  isVerified: {
    type: Boolean,
    required: false,
  },
  details: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Details",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email: email });
  return user;
};

const user = mongoose.model("User", userSchema);

module.exports = { User: user };
