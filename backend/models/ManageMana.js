// model/Organize.js
const mongoose = require("mongoose");

const ManageManaSchema = new mongoose.Schema({
  // Foriegn Key
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager', required: true },

  // ข้อมูลส่วนตัว
  firstName:  { type: String, required: true },
  lastName:   { type: String, required: true },
  gender:     { type: String, enum: ["ชาย", "หญิง"], required: true, },
  age:        { type: String, required: true },
  role:       { type: String, enum: ["มือสมัครเล่น", "มืออาชีพ"], required: true },
});

module.exports = mongoose.model("ManageMana", ManageManaSchema);
