// models/Location.js
const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    // ข้อมูลสถานที่จัดการแข่งขัน
    locationName:   { type: String, required: true },
    province:       { type: String, required: true },
    district:       { type: String, required: true },
    subDistrict:    { type: String, required: true },
    postalCode:     { type: String, required: true },
    detailLocation: { type: String },

    // เชื่อมกับ Organizer (1 Organizer มีหลาย Location)
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organizer',
        required: true
    }
});

module.exports = mongoose.model('Location', LocationSchema);