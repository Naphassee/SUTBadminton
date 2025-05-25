module.exports = function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        // ต้องเรียก authMiddleware มาก่อน จึงจะมี req.user
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'ไม่ได้รับสิทธิ์' });
        }
        next();
    };
};