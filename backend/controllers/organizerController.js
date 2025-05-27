const Organizer = require('../models/Organizer');
const bcrypt    = require('bcryptjs');

exports.updateProfile = async (req, res) => {
    try{
        const organizerId = req.params.id;
        // ยืนยันว่า user ที่ล็อคอินอยู่ตรงกับ organizerId
        if (req.user.id !== organizerId ){
            return res.status(403).json({ msg: 'ไม่อนุญาติให้ผู้ใช้แก้ไขข้อมูลบัญชีของผู้อื่น' });
        }

        // เก็บเฉพาะฟิลด์ที่อนุญาติให้แก้ไข
        const { firstName, lastName, phoneNumber, currentPassword, newPassword  } = req.body;
        const updateData = { firstName, lastName, phoneNumber };

        // ถ้ามีการขอเปลี่ยนรหัส !!!
        if (newPassword) {
            // ดึง organizer ปัจจุบันมาเช็ครหัสเก่า
            const organizer = await Organizer.findById(organizerId);
            const isMatch = await bcrypt.compare(currentPassword, organizer.password);

            if (!isMatch) {
                return res.status(400).json({ msg: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
            }

            // hash รหัสใหม่ก่อนเก็บ
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(newPassword, salt);
        }

        // ถ้ามี profileImage ใหม่ ให้บันทึก path
        if (req.files.profileImage) {
            updateData.profileImage = req.files.profileImage[0].filename;
        }

        // ถ้ามี qrCode ใหม่ ให้บันทึก path
        if (req.files.qrCode) {
            updateData.qrCode = req.files.qrCode[0].filename;
        }

        const updated = await Organizer.findByIdAndUpdate(
            organizerId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(updated);

    } catch (err){
        console.error(err);
        return res.status(500).json({ msg: 'Server error' });
    }
}