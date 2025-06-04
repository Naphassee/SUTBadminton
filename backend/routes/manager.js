const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { updateProfile } = require('../controllers/managerController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

router.put(
    '/:id',
    authMiddleware,
    authorizeRole('manager'),
    updateProfile
);

module.exports = router;
