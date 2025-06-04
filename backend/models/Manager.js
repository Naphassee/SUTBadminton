// model/Organize.js
const mongoose = require("mongoose");

const ManagerSchema = new mongoose.Schema({
  // ข้อมูลส่วนตัว
  firstName:    { type: String, required: true },
  lastName:     { type: String, required: true },
  password:     { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  phoneNumber:  { type: String, required: true },
});

module.exports = mongoose.model("Manager", ManagerSchema);
