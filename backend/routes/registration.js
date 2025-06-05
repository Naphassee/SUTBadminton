const express = require('express');
const upload = require('../config/multer');
const router = express.Router();
const regisCtrl = require('../controllers/registrationController');

router.post(
  '/registerTeam',
  regisCtrl.registerTeam
);

router.get(
  '/byManager/:managerId',
  regisCtrl.getRegByManager
);

router.post(
  '/uploadSlip',
  upload.single('slipImage'),
  regisCtrl.uploadSlip
);

router.get(
  '/byOrganizer/:organizerId', 
  regisCtrl.getRegByOrganizer
);

router.get(
  '/byTournament/:tournamentId/:organizerId', 
  regisCtrl.getRegByTournament
);

router.patch(
  '/:registrationId/statusByOrganizer', 
  regisCtrl.updateStatusByOrganizer
);

module.exports = router;