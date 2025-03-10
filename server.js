const express = require('express')
const mongoose = require('mongoose')
const facultyApi = require('./APIs/facultyApi')
const scheduleApi = require('./APIs/scheduleApi')
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

//   const Room = require("./models/Room");
  const Timetable = require("./models/Timetable");
  app.get("/available-rooms", async (req, res) => {
    const { day, timeSlot } = req.query;

    try {
        const occupiedRooms = await Timetable.find({ day, timeSlot }).select("roomNumber");
        const occupiedRoomNumbers = occupiedRooms.map(r => r.roomNumber);

        const availableRooms = await Room.find({ roomNumber: { $nin: occupiedRoomNumbers } });

        res.json(availableRooms);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});


// 📌 API: Allocate Room for Exam
app.post("/allocate-room", async (req, res) => {
    const { roomNumber, day, timeSlot } = req.body;

    try {
        const room = await Room.findOne({ roomNumber });

        if (!room) {
            return res.status(404).send("Room not found");
        }

        // Check if the room is already booked
        const existingBooking = await Timetable.findOne({ day, timeSlot, roomNumber });

        if (existingBooking) {
            return res.status(400).send("Room is already occupied");
        }

        // Allocate the room
        const newBooking = new Timetable({ day, timeSlot, roomNumber, status: "occupied" });
        await newBooking.save();

        res.json({ message: "Room allocated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});
  // Start the server
  const PORT = process.env.PORT;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));