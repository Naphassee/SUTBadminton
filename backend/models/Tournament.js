// models/Tournament.js
const mongoose = require('mongoose');

const TypeSchema = new mongoose.Schema({
  typename:           { type: String, required: true },
  participants:       { type: Number, required: true },
  registFee:          { type: Number, required: true },
  rule:               { type: String, required: true }
});

const TournamentSchema = new mongoose.Schema({
  // รูปโปรโมต
  promoteImage:       { type: String },

  // ข้อมูลทัวร์นาเมนต์
  tourName:           { type: String, required: true },
  tourTagline:        { type: String, required: true },
  deadlineOfRegister: { type: Date, required: true },
  startTour:          { type: Date, required: true },
  endTour:            { type: Date, required: true },

  // ข้อมูลรายละเอียดสถานที่จัดแข่ง
  locationName:       { type: String, required: true },
  province:           { type: String, required: true },
  district:           { type: String, required: true },
  subDistrict:        { type: String, required: true },
  detailLocation:     { type: String },

  // ประเภทการแข่งขัน (array of sub-documents)
  types:              [TypeSchema],

  createdAt:          { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tournament', TournamentSchema);
