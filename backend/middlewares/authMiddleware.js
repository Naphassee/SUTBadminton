const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ msg: 'ไม่มี token, ปฏิเสธการเข้าใช้งาน' });
    }

    const token = authHeader.replace('Bearer ', '');
    try {
        // ตรวจสอบและ decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // เก็บข้อมูลใน req.user เพื่อให้ใช้ต่อ
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Token ไม่ถูกต้อง' });
    }
};
