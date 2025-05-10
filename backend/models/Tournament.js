// models/Tournament.js
const mongoose = require('mongoose');

const TypeSchema = new mongoose.Schema({
  typename:    { type: String, required: true },
  participants:{ type: Number, required: true },
  registFee:   { type: Number, required: true },
  rule:        { type: String, required: true }
});

const TournamentSchema = new mongoose.Schema({
  // ข้อมูล organizer
  userName:    { type: String, required: true },
  firstName:   { type: String, required: true },
  lastName:    { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email:       { type: String, required: true },

  // รูปโปรโมต
  promoteImage: { type: String },

  // ข้อมูลทัวร์นาเมนต์
  tourName:        { type: String, required: true },
  tourTagline:     { type: String, required: true },
  deadlineOfRegister: { type: Date, required: true },
  startTour:       { type: Date, required: true },
  endTour:         { type: Date, required: true },
  location:        { type: String, required: true },

  // ประเภทการแข่งขัน (array of sub-documents)
  types: [TypeSchema],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tournament', TournamentSchema);
