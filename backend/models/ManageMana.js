// model/Organize.js
const mongoose = require("mongoose");

const ManagerManaSchema = new mongoose.Schema({
  // ข้อมูลส่วนตัว
  firstName:  { type: String, required: true },
  lastName:   { type: String, required: true },
  gender:     { type: String, required: true, },
  age:        { type: String, required: true },
  role:       { type: String, enum: ["Amateur", "Professional"], required: true },
});

module.exports = mongoose.model("ManagerMana", ManagerManaSchema);
