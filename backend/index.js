const express = require('express')
const cors = require('cors')
const app = express()
const router = require('./routes/auth.route')
const mongoose = require('mongoose')

// Environment variables
require('dotenv').config()

// BOdy parser for the JSON request
app.use(express.json())

// Enables the CORS for calls to the express server
app.use(cors())

// Default prefix for the routes
app.use('/v1', router)

app.listen(process.env.PORT, () => {
  console.log(process.env.MONGODB_URI)
  mongoose.connect(process.env.MONGODB_URI)
  console.log(`Conntected to application on PORT:${process.env.PORT}`)
})
