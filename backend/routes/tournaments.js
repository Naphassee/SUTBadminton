const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const tourCtrl = require('../controllers/TournamentController');
const { tourValid } = require('../middlewares/tournamentValidators');

// GET /api/tournaments
router.get('/', tourCtrl.getAll);

// POST /api/tournaments
router.post(
  '/',
  upload.single('promoteImage'),
  tourValid,
  tourCtrl.create
);

module.exports = router;