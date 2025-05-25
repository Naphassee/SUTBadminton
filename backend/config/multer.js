const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    // ตั้งชื่อไฟล์ซ้ำไม่ได้ เช่น timestamp-ต้นฉบับ
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});
module.exports = multer({ storage });