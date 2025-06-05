import mongoose from 'mongoose';

const PollSchema = new mongoose.Schema({
  match: String,
  options: [String], // e.g. ['برد تیم', 'مساوی', 'باخت تیم']
  correctOption: String,
  correctScore: Number, // تعداد گل درست
  answers: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    option: String,
    goalCount: Number,
    score: Number
  }]
});

export default mongoose.model('Poll', PollSchema);
