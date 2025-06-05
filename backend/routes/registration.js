const express = require('express');
const router = express.Router();
const regisCtrl = require('../controllers/registrationController');

router.post(
  '/registerTeam',
  regisCtrl.registerTeam
);

module.exports = router;