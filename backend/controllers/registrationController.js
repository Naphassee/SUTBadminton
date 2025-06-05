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

        // ดึง ManageMana มาเช็คคู่กับ Tournament
        const manageManas = await ManageMana.find({ _id: { $in: manageManaId } });
        if (manageManas.length !== manageManaId.length) {
          return res.status(400).json({ message: 'มีผู้เล่นบางคนไม่พบในระบบ ManageMana' });
        }

        const tournamentLevel = tournament.level;
        const tournamentGender = tournament.gender;
        for (const mm of manageManas) {
          if (mm.role !== tournamentLevel) {
            return res.status(400).json({
              message: `ผู้เล่น ${mm.firstName} ${mm.lastName} มี role: '${mm.role}' ไม่ตรงกับ level ของทัวร์นาเมนต์ ('${tournamentLevel}')`
            });
          }
        if (mm.gender !== tournamentGender) {
          return res.status(400).json({
            message: `ผู้เล่น ${mm.firstName} ${mm.lastName} มี gender: '${mm.gender}' ไม่ตรงกับ gender ของทัวร์นาเมนต์ ('${tournamentGender}')`
          });
        }
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
        slipImage: `/uploads/${slipFile.filename}`,
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

//ดึงรายการ Registration ของ Organizer คนนี้
exports.getRegByOrganizer = async (req, res) => {
  try {
    const { organizerId } = req.params;

    // 1) หา Tournament ที่จัดโดย organizerId นี้
    const tours = await Tournament.find({ organizerId }).select('_id');
    const tourIds = tours.map(t => t._id);

    // 2) หา Registration ที่ tournamentId ∈ tourIds
    const registrations = await Registration.find({
      tournamentId: { $in: tourIds }
    })
      .populate({
        path: 'tournamentId',
        populate: { path: 'organizerId', model: 'Organizer' } // step 3
      })
      .lean();

    // 3) สำหรับแต่ละ Registration ให้ดึง RegPlayer/ManageMana มาเติม property .players
    for (let reg of registrations) {
      const playersPopulated = await RegPlayer.find({ registrationId: reg._id })
        .populate({ path: 'manageManaId', model: 'ManageMana' });
      reg.players = playersPopulated.map(p => p.manageManaId);
    }

    res.json({ registrations });
  } catch (err) {
    console.error('getRegByOrganizer error:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด getRegByOrganizer', error: err.message });
  }
};

exports.getRegByTournament = async (req, res) => {
  try {
    const { tournamentId, organizerId } = req.params;

    // 1) หา Tournament ตรงกับ ID แล้ว populate organizerId
    const tour = await Tournament.findById(tournamentId)
      .populate({ path: 'organizerId', select: '_id' });
    if (!tour) {
      return res.status(404).json({ message: 'ไม่พบทัวร์นาเมนต์นี้' });
    }

    // 2) เช็คว่า organizerId ที่ path ส่งมาตรงกับ tour.organizerId จริงหรือไม่
    if (!tour.organizerId._id.equals(organizerId)) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์ดูการสมัครของทัวร์นาเมนต์นี้' });
    }

    // 3) หา Registration ของทัวร์นาเมนต์นี้
    const registrations = await Registration.find({ tournamentId })
      .populate({
        path: 'tournamentId',
        select: 'tourName province level gender registFee status',
      })
      .populate({ path: 'managerId', select: 'firstName lastName' }) // ถ้าต้องการชื่อผู้จัดการ
      .lean();

    // 4) สำหรับแต่ละ Registration ให้ populate รายชื่อนักกีฬา
    for (let reg of registrations) {
      const playersPopulated = await RegPlayer.find({ registrationId: reg._id })
        .populate({ path: 'manageManaId', model: 'ManageMana', select: 'firstName lastName' });
      reg.players = playersPopulated.map(p => p.manageManaId);
    }

    res.json({ registrations });
  } catch (err) {
    console.error('getRegByTournament error:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด getRegByTournament', error: err.message });
  }
};

//ให้ Organizer อนุมัติ/เปลี่ยนสถานะ Registration ใด ๆ 
exports.updateStatusByOrganizer = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { status } = req.body; // ค่าที่จะอัปเดต เช่น 'ชำระแล้ว', 'เสร็จสิ้น', 'ไม่ผ่านการตรวจสอบ'
    const organizerId = req.body.organizerId; // ส่งมาเพื่อเช็คสิทธิ์

    // 1) หา Registration พร้อม populate tournamentId → organizerId
    const reg = await Registration.findById(registrationId)
      .populate({
        path: 'tournamentId',
        select: 'organizerId', 
        populate: { path: 'organizerId', model: 'Organizer', select: '_id' }
      });
    if (!reg) {
      return res.status(404).json({ message: 'ไม่พบการสมัครนี้' });
    }

    // 2) เช็คว่า Organizer คนนี้เป็นเจ้าของทัวร์นาเมนต์นั้นจริงหรือไม่
    if (!reg.tournamentId.organizerId._id.equals(organizerId)) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์เปลี่ยนสถานะ' });
    }

    // 3) เปลี่ยน status
    reg.status = status;
    await reg.save();

    // 4) (ถ้าต้องการ) ถ้า status = 'เสร็จสิ้น' ก็อัปเดต currentParticipants ใน Tournament ด้วย
    if (status === 'เสร็จสิ้น') {
      await Tournament.findByIdAndUpdate(
        reg.tournamentId._id,
        { $inc: { currentParticipants: reg.playerCnt } }
      );
    }

    res.json({ message: 'เปลี่ยนสถานะสำเร็จ', registration: reg });
  } catch (err) {
    console.error('updateStatusByOrganizer error:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด updateStatusByOrganizer', error: err.message });
  }
};