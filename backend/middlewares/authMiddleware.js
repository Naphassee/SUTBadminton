const jwt = require("jsonwebtoken");
const Manager = require("../models/Manager");

const authenticateToken = async (req, res, next) => {
  const token = req.cookies["jwt"];

  if (!token)
    return res.status(401).send({ message: "Authentication token required" });

  try {
    const claims = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!claims._id) {
      return res.status(401).send({ message: "Invalid authentication token" });
    }

    const employee = await Manager.findOne({ _id: claims._id });

    if (!employee)
      return res.status(401).send({ message: "Invalid authentication token" });

    req.employee = employee;

    next();
  } catch (err) {
    res.status(401).send({ message: "Invalid authentication token" });
  }
};

module.exports = authenticateToken;
