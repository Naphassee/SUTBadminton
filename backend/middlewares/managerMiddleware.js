// const validateProfileData = (req, res, next) => {
//   const { firstName, lastName, email, phoneNumber } = req.body;

//   if (!firstName || !lastName || !email || !phoneNumber) {
//     return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
//   }

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const phoneRegex = /^[0-9]{9,10}$/; // รองรับเบอร์ไทย 9-10 หลัก

//   if (!emailRegex.test(email)) {
//     return res.status(400).json({ message: 'อีเมลไม่ถูกต้อง' });
//   }

//   if (!phoneRegex.test(phoneNumber)) {
//     return res.status(400).json({ message: 'เบอร์โทรไม่ถูกต้อง' });
//   }

//   next();
// };

// module.exports = { validateProfileData };
