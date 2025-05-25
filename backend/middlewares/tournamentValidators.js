const { check } = require('express-validator');

exports.tourValid = [
    check('tourName').notEmpty().withMessage('กรุณาระบุชื่อทัวร์นาเมนต์'),
    check('tourTagline').notEmpty().withMessage('กรุณาระบุกล่าวนำทัวร์นาเมนต์'),
    check('deadlineOfRegister').isISO8601().withMessage('กรุณาระบุวันปิดรับสมัคร'),
    check('startTour').isISO8601().withMessage('กรุณาระบุวันเริ่มทัวร์นาเมนต์'),
    check('endTour').isISO8601().withMessage('กรุณาระบุวันสิ้นสุดทัวร์นาเมนต์'),

    check('locationName').notEmpty().withMessage('กรุณาระบุชื่อสถานที่จัดแข่ง'),
    check('province').notEmpty().withMessage('กรุณาระบุจังหวัด'),
    check('district').notEmpty().withMessage('กรุณาระบุอำเภอ'),
    check('subDistrict').notEmpty().withMessage('กรุณาระบุตำบล'),
    check('detailLocation').notEmpty().withMessage('กรุณาระบุรายละเอียดสถานที่จัดแข่ง'),

    check('types').custom(v => {
        try {
          const arr = JSON.parse(v);
          return Array.isArray(arr) && arr.length > 0;
        } catch { return false; }
      }).withMessage('กรุณาเพิ่มประเภทการแข่งขันอย่างน้อย 1 ประเภท'),
    
];