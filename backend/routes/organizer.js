const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { updateProfile } = require('../controllers/organizerController');
const authMiddleware = require('../middlewares/authMiddleware');

router.put(
    '/:id',
    authMiddleware,
    upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'qrCode', maxCount: 1 }
    ]),
    updateProfile
);

module.exports = router;