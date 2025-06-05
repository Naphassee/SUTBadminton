const Registration = require('../models/Registration');
const RegPlayer = require('../models/RegPlayer');
const Tournament = require('../models/Tournament');
const ManageMana = require('../models/ManageMana');

//ลงสมัครทัวร์นาเมนต์
exports.registerTeam = async (req, res) => {
    try {
        console.log('ข้อมูลที่ client ส่งมา:', req.body);
        const { tournamentId, managerId, manageManaId } = req.body
        //ตรวจสอบ tournament ว่ามีอยู่มั้ย
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            return res.status(404).json({ message: 'ไม่พบทัวร์นาเมนต์' });
        }

        //จำนวนที่เหลือรับสมัคร
        const currentRegCount = tournament.currentParticipants;// จำนวนคนที่สมัครไปแล้ว
        const newPlayerCount = manageManaId.length;// จำนวนคนที่สมัครรอบนี้
        if (currentRegCount + newPlayerCount > tournament.participants) {
            return res.status(400).json({ message: `ขณะนี้เหลือจำนวนที่รับสมัคร (${tournament.participants - currentRegCount}) คน` });
        }

        //นับจำนวนนักกีฬาที่สมัครไปแล้วในทัวร์นาเมนต์นี้
        const duplicated = [];
        for (const playerId of manageManaId) {
            const existed = await RegPlayer.findOne({ manageManaId: playerId })
                .populate({ path: 'registrationId', match: { tournamentId } });
            
            if (existed && existed.registrationId) duplicated.push(playerId);
        }
        if (duplicated.length > 0) {
            return res.status(400).json({ msg: 'มีนักกีฬาที่เคยสมัครไปแล้ว', duplicated });
        }

        // สร้างregistrationใหม่และบันทึกลงฐานข้อมูล (สถานะ: รอชำระเงิน)
        const registration = await Registration.create({
            tournamentId,
            managerId,
            playerCnt: newPlayerCount,
            totalFee: tournament.registFee * newPlayerCount,
            slipImage: '',
        });

        //ผูก RegPlayer ทีละคน
        for (const playerId of manageManaId) {
            try {
                await RegPlayer.create({
                    registrationId: registration._id,
                    manageManaId: playerId
                });
            } catch (err) {
                console.error('เกิดข้อผิดพลาดตอนสร้าง RegPlayer:', err.message);
            }
        }

        res.status(201).json({ message: 'สมัครสำเร็จ', registrationId: registration._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
};

// แสดงรายการที่ manager สมัคร 
exports.getRegByManager = async (req, res) => {
  try {
    const { managerId } = req.params;

    // 1) ดึง Registration ทั้งหมดที่ managerId ตรงกัน 
    const registrations = await Registration.find({ managerId })
      .populate({
        path: 'tournamentId',
        populate: { path: 'organizerId', model: 'Organizer' }  // <-- แทรก nested populate
      })
      .lean();

    // 2) สำหรับแต่ละ registration ให้ดึง RegPlayer และ populate manageManaId 
    for (let reg of registrations) {
      const playersPopulated = await RegPlayer.find({ registrationId: reg._id })
        .populate({ path: 'manageManaId', model: 'ManageMana' });
      reg.players = playersPopulated
        .map(p => p.manageManaId)
        .filter(p => p !== null);
    }

    res.json({ registrations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// อัปโหลดสลิปพร้อมเปลี่ยนสถานะเป็นชำระงเินแล้ว
exports.uploadSlip = async (req, res) => {
  try {
    const { registrationId } = req.body;
    const slipFile = req.file;

    if (!slipFile) {
      return res.status(400).json({ message: 'กรุณาแนบไฟล์สลิป' });
    }

    const updated = await Registration.findByIdAndUpdate(
      registrationId,
      {
        slipImage: `/uploads/slips/${slipFile.filename}`,
        status: 'ชำระแล้ว',
      },
      { new: true }
    );

    res.json({ message: 'แนบสลิปสำเร็จ', updated });
  } catch (err) {
    console.error('uploadSlip error:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};