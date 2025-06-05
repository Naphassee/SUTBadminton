//get employee read (get by id)
const Employee = require("../models/ManageMana");
exports.read = async (req, res) => {
  try {
    console.log(req.body);
    const id = req.params.id;
    const employee = await Employee.findOne({ _id: id }).exec();
    res.status(200).json({
      message: "employee list",
      employee,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "server error",
    });
  }
};
// get employee list (get all)
exports.list = async (req, res) => {
  try {
    const employee = await Employee.find().exec();
    res.status(200).json({
      message: "employee list",
      employee,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "server error",
    });
  }
};
// create employee (post)
exports.create = async (req, res) => {
  try {
    console.log(req.body);
    const employee = await Employee({...req.body, managerId: req.user.id}).save();
    res.status(201).json({
      message: "employee created",
      employee,
    });
  } catch (err) {
    console.log(err);
    res.status(501).json({
      message: "server error",
    });
  }
};
// update employee (put)
exports.update = async (req, res) => {
  try {
    console.log(req.body);
    const id = req.params.id;
    const updated = await Employee.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    }).exec();
    res.status(202).json({
      message: "employee updated",
      employee: updated,
    });
  } catch (err) {
    console.log(err);
    res.status(502).json({
      message: "server error",
    });
  }
};
// delete employee (delete)
exports.delete = async (req, res) => {
  try {
    console.log(req.body);
    const id = req.params.id;
    const deleted = await Employee.findOneAndDelete({ _id: id }).exec();
    res.status(203).json({
      message: "employee deleted",
      deleted,
    });
  } catch (err) {
    console.log(err);
    res.status(503).json({
      message: "server error",
    });
  }
};

// ด้านบนมี exports.getAll แล้ว
exports.getMyPlayer = async (req, res) => {
  try {
    // หาเฉพาะทัวร์นาเมนต์ที่ organizer ตรงกับผู้ล็อกอิน
    const players = await Employee.find({ managerId: req.user.id });
    return res.json(players);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
}
