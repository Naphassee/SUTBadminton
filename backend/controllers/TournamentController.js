const Tournament = require('../models/Tournament');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
    try {
        const tours = await Tournament.find();
        res.json(tours);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
}

// ด้านบนมี exports.getAll แล้ว
exports.getMy = async (req, res) => {
  try {
    // หาเฉพาะทัวร์นาเมนต์ที่ organizer ตรงกับผู้ล็อกอิน
    const tours = await Tournament.find({ organizer: req.user.id });
    return res.json(tours);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
}
 
// สร้างข้อมูลทัวร์นาเมนต์
exports.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
      tourName, tourTagline, 
      deadlineOfRegister, startTour, endTour,
      locationName, province, district, subDistrict, detailLocation,
      level, gender, participants, registFee, rule
    //   types
    } = req.body;
    const promoteImage = req.file ? req.file.filename : null;

    // const typesArray = JSON.parse(types);

    try {
        const newTour = new Tournament({
            organizer: req.user.id,
            promoteImage,
            tourName, tourTagline, 
            deadlineOfRegister, startTour, endTour,
            locationName, province, district, subDistrict, detailLocation,
            level, gender, participants, registFee, rule
            // types: typesArray
        });

        await newTour.save();
        res.status(201).json(newTour);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'ชื่อทัวร์นาเมนต์นี้เคยถูกสร้างไปแล้ว' });
        }
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
}

// อัปเดตข้อมูลทัวร์นาเมนต์
exports.update = async (req, res) => {
  try {
    const tour = await Tournament.findById(req.params.id);
    if (!tour) return res.status(404).json({ msg: 'ไม่พบทัวร์นาเมนต์นี้' });

    // เช็คว่าเจ้าของทัวร์นาเมนต์ตรงกับผู้ล็อกอินไหม
    if (tour.organizer.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'ไม่อนุญาตให้แก้ไขทัวร์นาเมนต์นี้' });
    }

    Object.assign(tour, {
      ...req.body,
      promoteImage: req.file ? req.file.filename : tour.promoteImage
    });
    await tour.save();
    res.json(tour);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
}

// ลบทัวร์นาเมนต์
exports.remove = async (req, res) => {
  try {
    const tour = await Tournament.findById(req.params.id);
    if (!tour) return res.status(404).json({ msg: 'ไม่พบทัวร์นาเมนต์นี้' });

    if (tour.organizer.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'ไม่อนุญาตให้ลบทัวร์นาเมนต์นี้' });
    }

    await tour.deleteOne();
    res.json({ msg: 'ลบทัวร์นาเมนต์เรียบร้อยแล้ว' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
}