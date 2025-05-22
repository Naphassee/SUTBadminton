const { Router } = require("express");
const authController = require("../controllers/authController");
const authenticateToken = require("../middlewares/authMiddleware");
const router = Router();

//login, logout, auth routes
router.route("/register").post(authController.registerEmployee);
router.route("/login").post(authController.loginEmployee);
router.route("/logout").post(authController.logoutEmployee);
router.route("/managers").get(authenticateToken, authController.getEmployee);
router.route("/checkAuth").get(authenticateToken, authController.getEmployee);

module.exports = router;
