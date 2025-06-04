const Manager = require('../models/Manager');
const bcrypt    = require('bcryptjs');

exports.updateProfile = async (req, res) => {
    try{
        const managerId = req.params.id;
        // ยืนยันว่า user ที่ล็อคอินอยู่ตรงกับ organizerId
        if (req.user.id !== managerId ){
            return res.status(403).json({ msg: 'ไม่อนุญาติให้ผู้ใช้แก้ไขข้อมูลบัญชีของผู้อื่น' });
        }

        // เก็บเฉพาะฟิลด์ที่อนุญาติให้แก้ไข
        const { firstName, lastName, phoneNumber, email } = req.body;
        const updateData = { firstName, lastName, phoneNumber, email };

        const updated = await Manager.findByIdAndUpdate(
            managerId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(updated);

    } catch (err){
        console.error(err);
        return res.status(500).json({ msg: 'Server error' });
    }
}


