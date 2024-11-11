const mongoose = require("mongoose");

const detailsSchema = new mongoose.Schema({
  name: {
    type: String,
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
});

const Details = mongoose.model("Details", detailsSchema);

module.exports = { Details };
