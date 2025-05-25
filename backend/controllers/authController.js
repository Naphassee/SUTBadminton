const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = ({ Model, role }) => async (req, res) => {
    try{
        // ดึงชื่อไฟล์จาก req.files มาใส่ req.body
        if (req.files?.profileImage?.[0]) {
            req.body.profileImage = req.files.profileImage[0].filename;
        }
        if (req.files?.qrCode?.[0]) {
            req.body.qrCode = req.files.qrCode[0].filename;
        }

        // ตรวจซ้ำ email/userName
        const { email, userName } = req.body;
        const query = userName ? { $or: [{ email }, { userName }] }: { email };

        if (await Model.findOne(query)) {
            return res.status(400).json({ msg: 'ข้อมูลซ้ำ ไม่สามารถสมัครได้' });
        }

        // hash รหัสผ่าน
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);

        // สร้างเอกสารใหม่ในฐานข้อมูล
        const doc = new Model({ ...req.body, password: hashed });
        await doc.save();

        // สร้าง JWT เก็บ id+role ใน payload
        const token = jwt.sign(
            { id:doc._id, role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // ส่งกลับ token และข้อความ
        res.status(201).json({ token, msg: `${role} ลงทะเบียนสำเร็จ` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error'});
    }
};

exports.login = ({ Model, role }) => async (req, res) => {
    try {
        const { email, userName, password } = req.body;

        // หา user จาก email หรือ userName
        const filter  =userName ? { userName }: { email };
        const user = await Model.findOne(filter);
        if (!user) return res.status(404).json({ msg: 'ไม่พบบัญชีนี้' });

        // ตรวจ password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'รหัสผ่านไม่ถูกต้อง' });

        // สร้าง JWT
        const token = jwt.sign(
            { id: user._id, role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // ส่งกลับ token
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getMe = (Model) => async (req, res) => {
    try {
        const user = await Model.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(404).json({ msg: 'ไม่พบข้อมูลผู้ใช้' });
    }
};