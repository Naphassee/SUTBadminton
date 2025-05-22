const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Manager");
require("dotenv").config();

const COOKIE_NAME = "authenicationToken";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
};

const registerEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber = "",
      role = "manager",
    } = req.body;

    const existingEmployee = await Employee.findOne({ email });

    if (existingEmployee)
      return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const employee = new Employee({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    await employee.save();

    res.status(201).json({
      message: "Employee registered successfully",
      employee,
    });
  } catch (err) {
    console.error("Error during employee registration:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });

    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: employee.id, role: employee.role },
      JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    res.status(200).json({
      message: "Login successful",
      role: employee.role,
      token: token,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const logoutEmployee = (req, res) => {
  res.cookie(COOKIE_NAME, "", { ...COOKIE_OPTIONS, maxAge: 0 });
  res.json({ message: "Logout successful" });
};

const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).send({ message: "Employee not found" });
    }

    const { password, ...employeeData } = employee.toJSON();
    res.status(200).json(employeeData);
  } catch (err) {
    console.error("Error fetching employee info:", err);
    res.status(500).send({ message: "Internal server error" });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).send({ message: "Employee not found" });
    }
    res.status(200).json(updatedEmployee);
  } catch (err) {
    console.error("Error updating employee info:", err);
    res.status(500).send({ message: "Internal server error" });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).send({ message: "Employee not found" });
    }
    res.status(200).send({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  registerEmployee,
  loginEmployee,
  logoutEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
};
