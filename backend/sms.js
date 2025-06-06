// smsService.js
import axios from 'axios';

const SMS_API_URL = 'https://mysite.ir/api/v1/Send'; // Your SMS API endpoint
const SMS_TOKEN = process.env.SMS_TOKEN;
const SMS_SENDER = process.env.SMS_SENDER || '50001'; // Default sender number or 'line'

/**
 * Send a generic SMS message
 * @param {string} mobile - Recipient mobile number (e.g. 09123456789)
 * @param {string} message - SMS message content
 * @returns {Promise<object>} - API response data
 */
export async function sendSms(mobile, message) {
  const body = {
    Token: SMS_TOKEN,
    SenderNumber: SMS_SENDER,
    Mobile: mobile,
    Message: message
  };
  try {
    const { data } = await axios.post(SMS_API_URL, body, {
      headers: { 'Content-Type': 'application/json' }
    });
    return data;
  } catch (err) {
    throw new Error('Error communicating with SMS service: ' + err.message);
  }
}

/**
 * Send OTP SMS with a verification code
 * @param {string} mobile - Recipient mobile number
 * @param {string} otp - One-time password / verification code
 * @returns {Promise<boolean>} - true if sent successfully, otherwise throws error
 */
export async function sendOtpSms(mobile, otp) {
  const message = `کد ورود شما: ${otp}`;
  const data = await sendSms(mobile, message);

  if (data.Status === 0) {
    return true;
  } else {
    throw new Error(data.Messege || 'Error sending SMS');
  }
}
