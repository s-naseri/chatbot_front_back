// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  mobile: { type: String, unique: true },
  otp: String,
  otpExpiresAt: Date,
  createdAt: { type: Date, default: Date.now }
})
export default mongoose.model('User', UserSchema);

