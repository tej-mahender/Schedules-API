const express = require('express')
const mongoose = require('mongoose')
const facultyApi = require('./APIs/facultyApi')
const scheduleApi = require('./APIs/scheduleApi')

require('dotenv').config()

const app = express()
app.use(express.json())

mongoose
.connect(process.env.DB_URL)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Connection error', err))

  
  app.use('/faculties',facultyApi)
  app.use("/schedules", scheduleApi);

  
  // Start the server
  const PORT = process.env.PORT;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));