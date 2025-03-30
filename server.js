const express = require('express')
const mongoose = require('mongoose')
const facultyApi = require('./APIs/facultyApi')
const scheduleApi = require('./APIs/scheduleApi')
const studentApi = require('./APIs/studentApi')
const subjectApi = require('./APIs/subjectApi')
const seatingApi = require('./APIs/seatingApi')
const classroomApi = require('./APIs/classroomApi')
const loginApi = require('./APIs/loginApi');
const authApi = require('./APIs/authApi')

const cors = require('cors')

require('dotenv').config()

const app = express()
app.use(express.json())

app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend URL
    methods: "GET,POST,PUT,DELETE",  // Allowed methods
    allowedHeaders: "Content-Type,Authorization", // ✅ Allow Authorization header
    credentials: true // Allow cookies if needed
  })
);

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
  app.use('/login',loginApi)
app.use('/auth', authApi)

  // Start the server
  const PORT = process.env.PORT;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));