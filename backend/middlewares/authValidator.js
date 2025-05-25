const { check, validationResult } = require('express-validator');

exports.regRules = [
    check('firstName').notEmpty().withMessage('กรุณาระบุชื่อของท่าน'),
    check('lastName').notEmpty().withMessage('กรุณาระบุนามสกุลของท่าน'),
    check('email').isEmail().withMessage('กรุณาระบุอีเมลของท่าน'),
    check('password').isLength({ min:6 }).withMessage('รหัสผ่านต้องมี 6 ตัวขึ้นไป'),
    check('phoneNumber').isLength({ min:10 }).withMessage('กรุณาระบุเบอร์โทรศัพท์ของท่านถูกต้อง')
];

// สำหรับ organizer
exports.regOrgRules = [
    check('userName').notEmpty().withMessage('กรุณาระบุชื่อบัญชีผู้ใช้ของท่าน')
];

exports.loginRules = [
    check('email').isEmail().withMessage('กรุณาระบุอีเมลของท่านให้ถูกต้อง'),
    check('password').notEmpty().withMessage('กรุณาระบุรหัสผ่าน')
];

//
exports.loginOrgRules = [
    check('userName').notEmpty().withMessage('กรุณาระบุบัญชีผู้ใช้ให้ถูกต้อง'),
    check('password').notEmpty().withMessage('กรุณาระบุรหัสผ่าน')
];

// ตรวจสอบไฟล์รูปภาพ
exports.requireFiles = (fields) => (req, res, next) => {
  for (const field of fields) {
    if (!req.files?.[field] || req.files[field].length === 0) {
      return res
        .status(400)
        .json({ msg: `กรุณาอัปโหลดไฟล์ ${field} ด้วย` });
    }
  }
  next();
};

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
