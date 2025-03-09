const express = require('express')
const mongoose = require('mongoose')
const facultyApi = require('./APIs/facultyApi')
const scheduleApi = require('./APIs/scheduleApi')
const studentApi = require('./APIs/studentApi')
const subjectApi = require('./APIs/subjectApi')
const seatingApi = require('./APIs/seatingApi')
const classroomApi = require('./APIs/classroomApi')

const cors = require('cors')

require('dotenv').config()

const app = express()
app.use(express.json())

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
})); 

mongoose
.connect(process.env.DB_URL)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Connection error', err))

  
  app.use('/faculties',facultyApi)
  app.use("/schedules", scheduleApi);
  app.use('/students',studentApi)
  app.use('/subjects',subjectApi)
  app.use('/exams',seatingApi)
  app.use('/classrooms',classroomApi)
  app.use('/seating-plan',seatingApi)

  
  // Start the server
  const PORT = process.env.PORT;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));