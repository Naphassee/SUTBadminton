const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const Tournament = require('../models/Tournament');
const multer = require('multer');//ใช้สำหรับช่วยเก็บบันทึกรูปลงในฐานข้อมูล

// ตั้ง storage ของ multer (ง่ายสุดเก็บที่เครื่อง)
const upload = multer({ dest: 'uploads/' });

// GET all
router.get('/', async (req, res) => {
  const tours = await Tournament.find();
  res.json(tours);
});

// POST create
router.post('/',
  upload.single('promoteImage'),    // อ่านไฟล์จาก FormData field ชื่อ promoteImage
  [
    // validation ให้ตรงกับชื่อฟิลด์ที่ส่งมา
    check('userName',    'กรุณาระบุ userName').notEmpty(),
    check('firstName',   'กรุณาระบุ firstName').notEmpty(),
    check('lastName',    'กรุณาระบุ lastName').notEmpty(),
    check('phoneNumber', 'กรุณาระบุ phoneNumber').notEmpty(),
    check('email',       'กรุณาระบุ email').isEmail(),
    check('tourName',    'กรุณาระบุชื่อทัวร์นาเมนต์').notEmpty(),
    check('tourTagline', 'กรุณาระบุกล่าวนำทัวร์นาเมนต์').notEmpty(),
    check('deadlineOfRegister', 'กรุณาระบุวันปิดรับสมัคร').isISO8601(),
    check('startTour',   'กรุณาระบุวันเริ่มทัวร์นาเมนต์').isISO8601(),
    check('endTour',     'กรุณาระบุวันสิ้นสุดทัวร์นาเมนต์').isISO8601(),
    check('location',    'กรุณาระบุสถานที่แข่งขัน').notEmpty(),
    check('types',       'กรุณาเพิ่มประเภทการแข่งขันอย่างน้อย 1 ประเภท')
      .custom(v => {
        try {
          const arr = JSON.parse(v);
          return Array.isArray(arr) && arr.length > 0;
        } catch { return false; }
      })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // ดึงข้อมูลจาก req.body กับ req.file
    const {
      userName,
      firstName,
      lastName,
      phoneNumber,
      email,
      tourName,
      tourTagline,
      deadlineOfRegister,
      startTour,
      endTour,
      location,
      types
    } = req.body;

    const promoteImage = req.file ? req.file.filename : null;
    const typesArray = JSON.parse(types);

    // สร้าง document ใหม่
    const newTour = new Tournament({
      userName, firstName, lastName,
      phoneNumber, email,
      promoteImage,
      tourName, tourTagline,
      deadlineOfRegister, startTour,
      endTour, location,
      types: typesArray
    });

    try {
      await newTour.save();
      res.status(201).json(newTour);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);

module.exports = router;