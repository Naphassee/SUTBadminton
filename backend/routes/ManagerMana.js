const { Router } = require("express");
const employeeController = require("../controllers/ManagerManaController");
const authorizeRole = require('../middlewares/authorizeRole');
const authMiddleware = require('../middlewares/authMiddleware');
const router = Router();

// crud employee routes
router.route("/allTeam").get(employeeController.list);
router.route("/teamBy/:id").get(employeeController.read);
router.route("/pushTeam").post(authMiddleware, authorizeRole('manager'), employeeController.create);
router.route("/newTeam/:id").put(authMiddleware, authorizeRole('manager'), employeeController.update);
router.route("/removeTeam/:id").delete(authMiddleware, authorizeRole('manager'), employeeController.delete);
router.route("/getMyPlayer").get(authMiddleware, authorizeRole('manager'), employeeController.getMyPlayer);
module.exports = router;