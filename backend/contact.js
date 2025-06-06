import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },
  fullName: String,
  nationalCode: String,
  phone: String,
  company: String,
  address: String,
  notes: String
});

export default mongoose.model('Contact', ContactSchema);
