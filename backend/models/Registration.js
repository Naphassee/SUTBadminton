// model/Registration.js
const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    //Foriegn Key
    tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
    managerId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Manager', required: true },

    // ข้อมูลการสมัคร
    playerCnt:  { type: Number, required: true },
    totalFee:   { type: Number, required: true },
    slipImage:  { type: String },

    // สถานะการสมัคร
    status:     { type: String, enum: ['รอชำระเงิน', 'ชำระแล้ว', 'เสร็จสิ้น', 'ไม่ผ่านการตรวจสอบ'], default: 'รอชำระเงิน' },

    createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', RegistrationSchema);