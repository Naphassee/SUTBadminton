require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();
// เชื่อม DB
connectDB();

// มิดเดิลแวร์
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// ให้เบราเซอร์เข้าถึง http://localhost:5000/uploads/xxx.jpg ได้ตรง ๆ
app.use(
    '/uploads',
    express.static(path.join(__dirname, 'uploads'))
);

// routes
app.use('/api/tournaments', require('./routes/tournaments'));
// app.use('/api/users', require('./routes/users'));

app.use('/api/locations', require('./routes/locations'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
