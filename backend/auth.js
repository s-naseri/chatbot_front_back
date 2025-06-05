import express from 'express';
import User from './models/User.js';
import { sendOtpSms } from './smsService.js';

const router = express.Router();

// Helper: generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /send-otp - send verification code via SMS
router.post('/send-otp', async (req, res) => {
  try {
    const { name, mobile } = req.body;
    if (!name || !mobile) {
      return res.status(400).json({ error: 'نام و موبایل الزامی است.' });
    }

    // Validate mobile format
    if (!/^09\d{9}$/.test(mobile)) {
      return res.status(400).json({ error: 'شماره موبایل نامعتبر است.' });
    }

    let user = await User.findOne({ mobile });
    const otp = generateOtp();

    if (!user) {
      user = new User({ name, mobile });
    } else {
      user.name = name; // Update name if exists
    }

    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
    await user.save();

    await sendOtpSms(mobile, otp);

    res.json({ message: 'کد تایید ارسال شد.' });
  } catch (err) {
    console.error('Error in /send-otp:', err);
    res.status(500).json({ error: err.message || 'خطا در ارسال کد تایید' });
  }
});

// POST /verify-otp - verify code and login
router.post('/verify-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ error: 'موبایل و کد تایید الزامی است.' });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ error: 'کاربر یافت نشد.' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: 'کد تایید اشتباه است.' });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: 'کد منقضی شده است.' });
    }

    // Clear OTP fields after successful verification
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.json({ message: 'ورود موفق', userId: user._id, name: user.name });
  } catch (err) {
    console.error('Error in /verify-otp:', err);
    res.status(500).json({ error: err.message || 'خطا در تایید کد' });
  }
});

export default router;
