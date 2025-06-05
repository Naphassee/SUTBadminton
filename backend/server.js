require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const app = express();
// เชื่อม DB
connectDB();
//const updateProfileRoute = require('./routes/UpdateProfile');

// มิดเดิลแวร์
// ปรับ CORS ให้ explicit อนุญาต Authorization header และ Methods ต่างๆ
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// app.use('/api', updateProfileRoute);

// จัดการ body JSON
app.use(express.json());

// ให้เบราเซอร์เข้าถึง http://localhost:5000/uploads/xxx.jpg ได้ตรง ๆ
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
// app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/organizer', require('./routes/organizer'));
app.use('/api/tournaments', require('./routes/tournaments'));
app.use("/api/managermana", require("./routes/ManagerMana"));
app.use("/api/registration", require('./routes/registration'));

// app.use('/api/manager', require('./routes/managerRoutes')); 
// ใช้เส้นทาง manager ที่มีการจัดการโปรไฟล์
app.use("/api/manager", require("./routes/manager"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 

