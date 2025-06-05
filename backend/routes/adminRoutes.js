import express from 'express';
import User from '../models/User.js';
import Contact from '../models/Contact.js';

const router = express.Router();

// ادغام اطلاعات کاربران چت با دفترچه تلفن
router.get('/users', async (req, res) => {
  try {
    // 1. دریافت کاربران چت
    const chatUsers = await User.find({}, 'name mobile createdAt').lean();

    // 2. دریافت موبایل‌ها برای جستجو در دفترچه
    const mobiles = chatUsers.map(u => u.mobile);

    // 3. دریافت اطلاعات دفترچه تلفن
    const contacts = await Contact.find(
      { mobile: { $in: mobiles } },
      'mobile fullName nationalCode phone company address notes'
    ).lean();

    // 4. ادغام داده‌ها
    const mergedData = chatUsers.map(user => {
      const contact = contacts.find(c => c.mobile === user.mobile) || {};
      return {
        ...user,
        fullName: contact.fullName || '-',
        nationalCode: contact.nationalCode || '-',
        phone: contact.phone || '-',
        company: contact.company || '-',
        address: contact.address || '-',
        notes: contact.notes || '-'
      };
    });

    res.json(mergedData);
  } catch (err) {
    console.error('خطا در ادغام داده‌ها:', err);
    res.status(500).json({ error: 'خطا در دریافت اطلاعات کاربران' });
  }
});

export default router;
