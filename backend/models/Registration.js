// model/Registration.js
const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    //Foriegn Key
    tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager', required: true },

    // ข้อมูลการสมัคร
    playerCnt: { type: Number, required: true },
    totalFee: { type: Number, required: true },
    slipImage: { type: String, required: true },
    orgQrCode: { type: String, required: true },

    // สถานะการสมัคร
    status: { type: String, enum: ['รอดำเนินการ', 'อนุมัติ', 'ถูกปฏิเสธ'], default: 'รอดำเนินการ', required: true },

    createdAt:          { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', RegistrationSchema);