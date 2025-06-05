const Registration = require('../models/Registration');
const RegPlayer = require('../models/RegPlayer');
const Tournament = require('../models/Tournament');

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
}