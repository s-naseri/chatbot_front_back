import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  content: { type: String, required: true },
  language: { type: String, required: true },
  embedding: { type: [Number], default: [] },
  audioUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  imageUrl: { type: String, default: '' },

  createdAt: { type: Date, default: Date.now }
});

// Create a text index on content for text search
DocumentSchema.index({ content: 'text' });

export default mongoose.model('Document', DocumentSchema);
