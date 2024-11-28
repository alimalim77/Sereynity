const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./routes/index");
const mongoose = require("mongoose");

// Environment variables
require("dotenv").config();

// BOdy parser for the JSON request
app.use(express.json());

// Enables the CORS for calls to the express server
app.use(cors());

// Default prefix for the routes
app.use("/v1", router);

// Only connect to MongoDB and start the server if not in the test environment
const PORT = process.env.NODE_ENV === "test" ? 8084 : process.env.PORT;
console.log(PORT);
app.listen(PORT, async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to MongoDB at ${process.env.MONGODB_URI}`);
    console.log(`Connected to application on PORT: ${process.env.PORT}`);
  } catch (error) {
    process.exit(1);
  }
});

//For external uses like testing
module.exports = app;
