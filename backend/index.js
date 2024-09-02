const express = require("express");
const cors = require("cors");
const app = express();

// Environment variables
require("dotenv").config();

// BOdy parser for the JSON request
app.use(express.json());

// Enables the CORS for calls to the express server
app.use(cors());

app.get("/", (req, res) => {
  console.log(req.body);
});

app.listen(process.env.PORT, () => {
  console.log(`Conntected to application on PORT:${process.env.PORT}`);
});
