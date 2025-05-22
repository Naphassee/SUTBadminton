const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // สร้าง JWT
const Organizer = require('../models/Organizer'); // โมเดล Mongoose ของ Organizer
const organizerMiddleware = require('../middlewares/organizerMiddleware');

const multer      = require('multer');
const upload      = multer({ dest: 'uploads/' });  // ปรับ config ตามต้องการ

const router = express.Router();

// GET all
router.get('/', async (req, res) => {
  const orgs = await Organizer.find();
  res.json(orgs);
});

// GET /api/auth/me
router.get('/me', organizerMiddleware, async (req, res) => {
  try {
    const org = await Organizer.findById(req.userId).select('-password');
    if (!org) return res.status(404).json({ msg: 'ไม่พบผู้ใช้นี้' });
    res.json(org);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post('/register', // เมื่อมี POST ไปที่ /api/auth/register เอาไปใช้ที่ server.js
    upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'qrCode',       maxCount: 1 }
    ]),
    [
        check('firstName',  'กรุณาระบุชื่อของท่าน').notEmpty().withMessage(),
        check('lastName',   'กรุณาระบุนามสกุลของท่าน').notEmpty().withMessage(),
        check('userName',   'กรุณาระบุชื่อบัญชีผู้ใช้ของท่าน').notEmpty().withMessage(),
        check('email').isEmail().withMessage('กรุณาระบุอีเมลของท่าน'),
        check('password').isLength({ min:6 }).withMessage('รหัสผ่านต้องมี 6 ตัวขึ้นไป'),
        check('phoneNumber').isLength({ min:10 }).withMessage('กรุณาระบุเบอร์โทรศัพท์ของท่านถูกต้อง')
    ],
    async (req, res) => {
        // ตรวจสอบ validation
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            // ส่งกลับ array ของข้อผิดพลาด
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const {
                firstName,
                lastName,
                userName,
                email,
                password,
                phoneNumber
            } = req.body;

            const profileImage = req.files?.profileImage?.[0]?.filename || null;
            const qrCode = req.files?.qrCode?.[0]?.filename || null;


            // เช็คว่ามี userName หรือ email ซ้ำมั้ย
            let exist = await Organizer.findOne({
                $or: [{ userName }, { email }]
            });
            if (exist) {
                return res.status(400).json({ msg: 'ชื่อบัญชีผู้ใช้ หรือ อีเมล นี้มีคนใช้แล้ว '});
            }

            // สร้าง salt และ hash รหัสผ่าน
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // สร้าง object ใหม่ และ save ไปฐานข้อมูล
            const newOrg = new Organizer({
                firstName,
                lastName,
                userName,
                email,
                password: hashedPassword,
                phoneNumber,
                qrCode,
                profileImage

            });
            await newOrg.save();

            // ส่ง response ยืนยันว่า register สำเร็จ
            res.status(201).json({ msg: 'ลงทะเบียนผู้จัดการแข่งขันสำเร็จ' });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }

    }
);

router.post('/login',
    [
        check('userName').notEmpty().withMessage('กรุณากรอกชื่อบัญชีผู้ใช้ของท่าน'),
        check('password').notEmpty().withMessage('กรุณากรอกรหัสผ่านของท่าน')
    ],
    async (req, res) => {
        // ตรวจสอบ input ที่กรอกมา
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            userName,
            password
        } = req.body;

        try {
            // หา record จากฐานข้อมูล
            const org = await Organizer.findOne({ userName });
            if (!org) {
                return res.status(400).json({ msg: 'ไม่พบบัญชีผู้ใช้' });
            }

            // 3 ตรวจสอบรหัสผ่าน
            const isMatch = await bcrypt.compare(password, org.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'รหัสผ่านไม่ถูกต้อง' });
            }

            // สร้าง JWT (ถ้าใช้)
            const token = jwt.sign(
                { id: org._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // ส่ง token กลับไปให้ client
            res.json({ token });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;