const { check } = require('express-validator');

exports.tourValid = [
    check('tourName').notEmpty().withMessage('กรุณาระบุชื่อทัวร์นาเมนต์'),
    check('tourTagline').notEmpty().withMessage('กรุณาระบุกล่าวนำทัวร์นาเมนต์'),

    check('deadlineOfRegister').isISO8601().withMessage('กรุณาระบุวันปิดรับสมัคร')
      .custom(value => {
        const selected = new Date(value);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (selected < today) {
          throw new Error('วันปิดรับสมัครต้องไม่เป็นวันที่ผ่านมาแล้ว')
        }
        return true;
    }),

    check('startTour').isISO8601().withMessage('กรุณาระบุวันเริ่มทัวร์นาเมนต์')
      .custom((value, {req}) => {
        const start = new Date(value);
        const deadline = new Date(req.body.deadlineOfRegister)
        if ( start <= deadline){
          throw new Error('ไม่อนุญาติให้กำหนดวันเริ่มการแข่งขันเป็นวันเดียวกับวันรับสมัครวันสุดท้าย')
        }
        return true;
    }),

    check('endTour').isISO8601().withMessage('กรุณาระบุวันสิ้นสุดทัวร์นาเมนต์')
      .custom((value, {req}) => {
        const end = new Date(value);
        const start = new Date(req.body.startTour);

        const diffSecs = (end.getTime() - start.getTime()) / 1000; //มันจะคำนวณหลัก มิลลิวินาทีจึงต้องหาร 1000 ให้กลายเป็นหน่วย วินาที
        // 2 ชั่วโมง = 7200 วินาที
        if (diffSecs < 7200) {
          throw new Error('วันสิ้นสุดทัวร์นาเมนต์ต้องอยู่หลังวันเริ่มอย่างน้อย 2 ชั่วโมง');
        }
        return true;
      }),

    check('locationName').notEmpty().withMessage('กรุณาระบุชื่อสถานที่จัดแข่ง'),
    check('province').notEmpty().withMessage('กรุณาระบุจังหวัด'),
    check('district').notEmpty().withMessage('กรุณาระบุอำเภอ'),
    check('subDistrict').notEmpty().withMessage('กรุณาระบุตำบล'),
    check('detailLocation').notEmpty().withMessage('กรุณาระบุรายละเอียดสถานที่จัดแข่ง'),

    check('level').isIn(["มือสมัครเล่น", "มืออาชีพ"]).withMessage('ระดับต้องเป็น "มือสมัครเล่น" หรือ "มืออาชีพ"'),
    check('gender').isIn(["ชาย", "หญิง"]).withMessage('เพศต้องเป็น "ชาย" หรือ "หญิง"'),
    check('participants').isInt({ min: 16 }).withMessage('จำนวนผู้เข้าสมัครต้องมีอย่างน้อย 16 คน'),
    check('registFee').isInt({ min: 0 }).withMessage('กรุณาระบุค่าลงสมัคร'),
    check('rule').notEmpty().withMessage('กรุณาระบุกฏการแข่งขัน')

    // check('types').custom(v => {
    //     try {
    //       const arr = JSON.parse(v);
    //       return Array.isArray(arr) && arr.length > 0;
    //     } catch { return false; }
    //   }).withMessage('กรุณาเพิ่มประเภทการแข่งขันอย่างน้อย 1 ประเภท'),
    
];