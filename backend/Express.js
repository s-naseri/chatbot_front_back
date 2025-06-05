import express from 'express';
import User from './models/User.js';
import Contact from './models/Contact.js'; // مدل دفترچه تلفن

const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { mobile: 1, name: 1 }).lean();

    // گرفتن شماره موبایل‌ها برای جستجو در دفترچه تلفن
    const mobiles = users.map(u => u.mobile);

    // گرفتن اطلاعات کامل‌تر از دفترچه تلفن بر اساس موبایل‌ها
    const contacts = await Contact.find({ mobile: { $in: mobiles } }).lean();

    // ادغام اطلاعات
    const mergedUsers = users.map(user => {
      const contact = contacts.find(c => c.mobile === user.mobile);
      return {
        mobile: user.mobile,
        name: user.name,
        family: contact?.family || '',
        nationalCode: contact?.nationalCode || '',
        phone: contact?.phone || '',
        companyName: contact?.companyName || '',
        // سایر فیلدهای مورد نیاز
        _id: user._id
      };
    });

    res.json(mergedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در دریافت کاربران' });
  }
});

export default router;
