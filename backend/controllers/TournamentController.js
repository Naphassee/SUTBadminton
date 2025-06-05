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

exports.getAvailable = async (req, res) => {
  try {
    const now = new Date();
    const availableTours = await Tournament.find({
      status: 'เปิดรับ',
      deadlineOfRegister: { $gt: now },
    });
    res.json(availableTours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tournament.findById(id);
    if (!tour) {
      return res.status(404).json({ msg: 'ไม่พบทัวร์นาเมนต์ที่ต้องการแก้ไข' });
    }
    return res.json(tour);
  } catch (err) {
    console.error('Error fetching tournament: ', error);
    res.status(500).json({ msg: 'เกิดข้อผิดพลาดในการดึงข้อมูลทัวร์นาเมนต์' });
  }
}

// ด้านบนมี exports.getAll แล้ว
exports.getMy = async (req, res) => {
  try {
    // หาเฉพาะทัวร์นาเมนต์ที่ organizerId ตรงกับผู้ล็อกอิน
    const tours = await Tournament.find({ organizerId: req.user.id });
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
      level, gender, participants, registFee, rule,
      status
    } = req.body;
    const promoteImage = req.file ? req.file.filename : null;

    try {
        const dataToSave = {
            organizerId: req.user.id,
            promoteImage,
            tourName, tourTagline, 
            deadlineOfRegister, startTour, endTour,
            locationName, province, district, subDistrict, detailLocation,
            level, gender, participants, registFee, rule,
        }

        // ถ้ามี req.body.status จริง ๆ เท่านั้น จึงเพิ่มเข้าไป
        if (typeof status !== 'undefined') {
          dataToSave.status = status;
        }
        // ถ้า status ไม่ได้ถูกส่งมาเลย (undefined) Mongoose จะเติม default ให้เป็น 'ฉบับร่าง'

        const newTour = new Tournament(dataToSave);

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
    if (tour.organizerId.toString() !== req.user.id) {
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

    if (tour.organizerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'ไม่อนุญาตให้ลบทัวร์นาเมนต์นี้' });
    }

    await tour.deleteOne();
    res.json({ msg: 'ลบทัวร์นาเมนต์เรียบร้อยแล้ว' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
}

// เปลี่ยนสถานะของทัวร์นาเมนต์
exports.changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ตรวจสอบสถานะที่กำหนดมาว่าถูกต้องหรือไม่
    const validStatuses = ['ฉบับร่าง', 'เปิดรับ', 'ปิดรับ', 'เต็ม'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: 'สถานะไม่ถูกต้อง' });
    }

    const tour = await Tournament.findById(id);
    if (!tour) {
      return res.status(404).json({ msg: 'ไม่พบทัวร์นาเมนต์นี้' });
    }

    // ตรวจสอบสิทธิ์ว่า organizer เป็นเจ้าของทัวร์หรือไม่
    if (tour.organizerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'คุณไม่มีสิทธิ์เปลี่ยนสถานะทัวร์นาเมนต์นี้' });
    }

    tour.status = status;
    await tour.save();
    res.json({ msg: 'อัปเดตสถานะสำเร็จ', tour });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะ' });
  }
}