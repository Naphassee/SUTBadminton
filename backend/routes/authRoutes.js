const express = require('express');
const { check } = require('express-validator');
const upload = require('../config/multer');
const { regRules, regOrgRules, loginRules, loginOrgRules, requireFiles, validate } = require('../middlewares/authValidator');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');
const { register, login, getMe } = require('../controllers/authController');
const Organizer = require('../models/Organizer');
const Manager = require('../models/Manager');

const router = express.Router();

// Register Organizer
router.post(
    '/organizers/register',
    upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'qrCode',       maxCount: 1 }
    ]),
    requireFiles(['profileImage', 'qrCode']),
    ...regRules,
    ...regOrgRules,
    validate,
    register({ Model: Organizer, role: 'organizer' })
);

/* -- ORGANIZER -- */
// Login Organizer 
router.post(
    '/organizers/login',
    loginOrgRules,
    validate,
    login({ Model: Organizer, role: 'organizer' })
);

// แสดง organizer ที่กำลังใช้งานอยู่
router.get(
    '/organizers/me',
    authMiddleware,
    authorizeRole('organizer'),
    getMe(Organizer)
);

/* -- MANAGER -- */
// Register Manager
router.post(
    '/managers/register',
    ...regRules,
    validate,
    register({ Model: Manager, role: 'manager' })
);

// Login Manager
router.post(
    '/managers/login',
    loginRules,
    validate,
    login({ Model: Manager, role: 'manager' })
);

// แสดง manager ที่กำลังใช้งานอยู่
router.get(
    '/managers/me',
    authMiddleware,
    authorizeRole('manager'),
    getMe(Manager)
);

module.exports = router;