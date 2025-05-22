const { Router } = require("express");
const employeeController = require("../controllers/ManagerManaController");
const router = Router();

// crud employee routes
router.route("/allTeam").get(employeeController.list);
router.route("/teamBy/:id").get(employeeController.read);
router.route("/pushTeam").post(employeeController.create);
router.route("/newTeam/:id").put(employeeController.update);
router.route("/removeTeam/:id").delete(employeeController.delete);
module.exports = router;
