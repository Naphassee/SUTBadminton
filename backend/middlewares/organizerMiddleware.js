const jwt = require('jsonwebtoken');

module.exports = function organizerMiddleware(req, res, next) {
  // อ่าน header Authorization
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ msg: 'ไม่มี token, ปฏิเสธการเข้าใช้งาน' });
  }

  // ตัดคำว่า “Bearer ”
  const token = authHeader.replace('Bearer ', '');
  try {
    // ตรวจสอบ token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // เก็บ userId ไว้ใช้ใน route ถัดไป
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token ไม่ถูกต้อง' });
  }
};