// models/Tournament.js
const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
  // Foriegn Key
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'Organizer', required: true },

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

  // ประเภทการแข่งขัน (ใหม่)
  level:              { type: String, enum: ["มือสมัครเล่น", "มืออาชีพ"], required: true },
  gender:             { type: String, enum: ["ชาย", "หญิง"], required: true },
  participants:       { type: Number, required: true },
  registFee:          { type: Number, required: true },
  rule:               { type: String, required: true },

  // สถานะทัวร์นาเมนต์
  status:             { type: String, enum: ['ฉบับร่าง','เปิดรับ','ปิดรับ','เต็ม'], default: 'ฉบับร่าง' },

  createdAt:          { type: Date, default: Date.now }
});

// ห้ามสร้างทัวร์นาเมนต์ที่มีชื่อซ้ำกันภายใน organizer คนเดียว
TournamentSchema.index({ organizer: 1, tourName: 1 }, { unique: true });

// ลบทัวร์นาเมนต์อัตโนมัติเมื่อ endTour ≤ now (expireAfterSeconds: 0)
TournamentSchema.index({ endTour: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Tournament', TournamentSchema);