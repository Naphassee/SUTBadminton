// model/Organize.js
const mongoose = require('mongoose');

const OrganizerSchema = new mongoose.Schema({
    // ข้อมูลส่วนตัว
    firstName:      { type: String, required: true },
    lastName:       { type: String, required: true },
    userName:       { type: String, required: true, unique: true },
    password:       { type: String, required: true },
    email:          { type: String, required: true, unique: true },
    phoneNumber:    { type: String, required: true },

    // ข้อมูลชนิดรูปภาพ
    qrCode:         { type: String },
    profileImage:   { type: String }
});

module.exports = mongoose.model('Organizer', OrganizerSchema);