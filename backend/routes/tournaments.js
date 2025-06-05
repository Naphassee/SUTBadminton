const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const tourCtrl = require('../controllers/TournamentController');
const { tourValid } = require('../middlewares/tournamentValidators');
const authorizeRole = require('../middlewares/authorizeRole');
const authMiddleware = require('../middlewares/authMiddleware');

// GET /api/tournaments
router.get(
  '/',
  tourCtrl.getAll
);

// GET /api/tournaments/my
router.get(
  '/my',
  authMiddleware,
  authorizeRole('organizer'),
  tourCtrl.getMy
);

router.get(
  '/available',
  tourCtrl.getAvailable
);

// POST /api/tournaments
router.post(
  '/',
  authMiddleware,
  authorizeRole('organizer'),
  upload.single('promoteImage'),
  tourValid,
  tourCtrl.create
);

// PUT /api/tournaments/:id
router.put(
  '/:id',
  authMiddleware,
  authorizeRole('organizer'),
  upload.single('promoteImage'),
  tourValid,
  tourCtrl.update
);

// DELETE /api/tournaments/:id
router.delete(
  '/:id',
  authMiddleware,
  authorizeRole('organizer'),
  tourCtrl.remove
);

router.get(
  '/:id',
  tourCtrl.getById
);

router.patch(
  '/:id/status',
  authMiddleware,
  authorizeRole('organizer'),
  tourCtrl.changeStatus
);

module.exports = router;