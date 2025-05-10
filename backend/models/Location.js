// models/Location.js
const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    // ข้อมูลสถานที่จัดการแข่งขัน
    locationName:   { type: String, required: true },
    province:       { type: String, required: true },
    district:       { type: String, required: true },
    subDistrict:    { type: String, required: true },
    postalCode:     { type: String, required: true },
    detailLocation: { type: String, required: true },
});

module.exports = mongoose.model('Location', LocationSchema);