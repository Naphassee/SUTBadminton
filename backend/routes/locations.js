const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const Location = require('../models/Location');

// GET ALL
router.get('/', async (req, res) => {
    const locates = await Location.find();
    res.json(locates);
});

// POST create
router.post('/',
  [
    // validation
    check('locationName').notEmpty().withMessage('กรุณาระบุชื่อสถานที่จัดแข่ง'),
    check('province').notEmpty().withMessage('กรุณาระบุจังหวัด'),
    check('district').notEmpty().withMessage('กรุณาระบุอำเภอ'),
    check('subDistrict').notEmpty().withMessage('กรุณาระบุตำบล'),
    check('postalCode').notEmpty().withMessage('กรุณาระบุรหัสไปรษณีย์'),
    check('detailLocation').notEmpty().withMessage('กรุณาระบุรายละเอียดสถานที่จัดแข่ง')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    const {
        locationName,
        province,
        district,
        subDistrict,
        postalCode,
        detailLocation
    } = req.body;
    
    // สร้าง document ใหม่
    const newLocate = new Location({
        locationName,
        province,
        district,
        subDistrict,
        postalCode,
        detailLocation
    });

    try {
        await newLocate.save();
        res.status(201).json(newLocate);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
  }
);

module.exports = router;