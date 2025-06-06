// models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  sender: { 
    type: String, 
    enum: ['user', 'bot'], 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['text', 'image', 'audio', 'video', 'file'], 
    default: 'text' 
  },
  content: { 
    type: String, 
    required: function() { return this.type === 'text'; } 
  },
  mediaUrl: { 
    type: String, 
    required: function() { return this.type !== 'text'; } 
  }
}, { 
  timestamps: true 
});

// Index to speed up queries by user and recent messages
messageSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);
