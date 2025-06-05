import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import multer from 'multer';
import { exec } from 'child_process';
import axios from 'axios';
import FormData from 'form-data';
import { Server } from 'socket.io';
import http from 'http';

import OpenAI from 'openai';

import User from './models/User.js';
import Message from './models/Message.js';
import Document from './models/Document.js';
import Poll from './models/Poll.js';
import './processUploads.js';


import { getEmbedding, cosineSimilarity } from './embedding.js';
import { getOpenAIResponseWithContext } from './openaiChat.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const __dirname = path.resolve();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(console.error);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- Avangard APIs ---
async function avangardSTT(audioFilePath) {
  try {
    const formData = new FormData();
    formData.append('audio', fs.createReadStream(audioFilePath));
    formData.append('apiKey', process.env.AVANGAR_STT_API_KEY);

    const response = await axios.post(
      'https://api.ivira.ai/partai/speechRecognition',
      formData,
      { headers: formData.getHeaders() }
    );

    return response.data.recognizedText || null;
  } catch (error) {
    console.error('Avangard STT error:', error);
    return null;
  }
}

async function avangardTTS(text) {
  try {
    const response = await axios.post(
      'https://api.ivira.ai/partai/TextToSpeech',
      { Text: text, apiKey: process.env.AVANGAR_TTS_API_KEY },
      { responseType: 'stream' }
    );

    const fileName = `tts-${Date.now()}.mp3`;
    const filePath = path.join(__dirname, 'uploads', fileName);
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(`/uploads/${fileName}`));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Avangard TTS error:', error);
    return null;
  }
}

// --- Helper: Extract audio from video using FFmpeg ---
function extractAudioFromVideo(videoPath, outputAudioPath) {
  return new Promise((resolve, reject) => {
    const cmd = `ffmpeg -i "${videoPath}" -vn -acodec pcm_s16le -ar 16000 -ac 1 "${outputAudioPath}" -y`;
    exec(cmd, (error) => {
      if (error) {
        console.error('FFmpeg error:', error);
        reject(error);
      } else {
        resolve(outputAudioPath);
      }
    });
  });
}

// --- Upload Handlers ---

// Upload audio file, transcribe, save document with embedding
app.post('/upload-audio', upload.single('audio'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No audio file uploaded' });

  const audioPath = req.file.path;
  const transcript = await avangardSTT(audioPath);
  if (!transcript) return res.status(500).json({ error: 'Speech recognition failed' });

  const embedding = await getEmbedding(transcript);

  const doc = new Document({
    filename: req.file.filename,
    content: transcript,
    language: 'fa',
    embedding,
    audioUrl: `/uploads/${req.file.filename}`
  });
  await doc.save();

  res.json({ message: 'Audio processed and saved', transcript, audioUrl: doc.audioUrl });
});

// Upload video file, extract audio, transcribe, save document with embedding and video URL
app.post('/upload-video', upload.single('video'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No video file uploaded' });
  const videoPath = req.file.path;
  const audioExtractPath = path.join(__dirname, 'uploads', `audio-from-video-${Date.now()}.wav`);

  try {
    await extractAudioFromVideo(videoPath, audioExtractPath);

    const transcript = await avangardSTT(audioExtractPath);
    if (!transcript) return res.status(500).json({ error: 'Speech recognition failed on video audio' });

    const embedding = await getEmbedding(transcript);

    const doc = new Document({
      filename: req.file.filename,
      content: transcript,
      language: 'fa',
      embedding,
      videoUrl: `/uploads/${req.file.filename}`
    });
    await doc.save();

    // Clean up extracted audio file
    await fsPromises.unlink(audioExtractPath);

    res.json({ message: 'Video processed and saved', transcript, videoUrl: doc.videoUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing video' });
  }
});

// Upload image with description, save document
app.post('/upload-image', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image file uploaded' });

  const { description } = req.body || '';

  const doc = new Document({
    filename: req.file.filename,
    content: description || '',
    language: 'fa',
    imageUrl: `/uploads/${req.file.filename}`,
    embedding: description ? await getEmbedding(description) : []
  });

  await doc.save();

  res.json({ message: 'Image and description saved', imageUrl: doc.imageUrl, description: doc.content });
});

// --- ضبط صدا: دریافت فایل صوتی و تبدیل به متن ---
app.post('/upload-voice', upload.single('audio'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'فایل صوتی ارسال نشد' });
  try {
    const transcript = await avangardSTT(req.file.path);
    // پاک کردن فایل صوتی پس از پردازش
    await fsPromises.unlink(req.file.path);
    if (!transcript) return res.status(500).json({ error: 'تشخیص گفتار با خطا مواجه شد' });
    res.json({ transcript });
  } catch (err) {
    console.error('خطا در پردازش صوت:', err);
    res.status(500).json({ error: 'خطا در پردازش صوت' });
  }
});

// --- User registration (test mode, no SMS/OTP) ---
app.post('/register', async (req, res) => {
  try {
    const { name, mobile, email } = req.body;
    if (!name || !mobile) return res.status(400).json({ error: 'نام و موبایل الزامی است' });

    let user = await User.findOne({ mobile });

    if (!user) {
      user = new User({ name, mobile, email });
      await user.save();
    }

    res.json({ user });
  } catch (err) {
    console.error('خطا در ثبت‌نام:', err);
    res.status(500).json({ error: 'خطا در ثبت‌نام' });
  }
});

// --- Poll answer and scoring ---
app.post('/polls/answer', async (req, res) => {
  try {
    const { pollId, userId, option, goalCount } = req.body;
    if (!pollId || !userId || !option) {
      return res.status(400).json({ error: 'pollId, userId and option are required' });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });

    // Check if user already answered
    const existingAnswer = poll.answers.find(a => a.userId.toString() === userId);
    if (existingAnswer) {
      return res.status(400).json({ error: 'User already answered this poll' });
    }

    // Calculate score
    let score = 0;
    if (option === poll.correctOption) {
      score += 3; // 3 points for correct prediction
    }
    if (typeof goalCount === 'number' && goalCount === poll.correctScore) {
      score += 1; // 1 point for correct goal count
    }

    // Save answer
    poll.answers.push({ userId, option, goalCount, score });
    await poll.save();

    // Update user total score
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.totalScore = (user.totalScore || 0) + score;
    await user.save();

    res.json({ message: 'Answer saved', score, totalScore: user.totalScore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Get user total score ---
app.get('/users/:userId/score', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ totalScore: user.totalScore || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Chat question answering ---
app.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'سوال لازم است' });

    const questionEmbedding = await getEmbedding(question);
    const docs = await Document.find();
    let bestDoc = null;
    let bestScore = 0;
    for (const doc of docs) {
      if (!doc.embedding || doc.embedding.length === 0) continue;
      const score = cosineSimilarity(questionEmbedding, doc.embedding);
      if (score > bestScore) {
        bestScore = score;
        bestDoc = doc;
      }
    }

    const threshold = 0.3;
    if (!bestDoc || bestScore < threshold) {
      return res.json({ answer: 'در حیطه تخصص من نیست.', audioUrl: null, videoUrl: null, imageUrl: null });
    }

    const answer = await getOpenAIResponseWithContext(question, bestDoc.content);

    res.json({
      answer,
      audioUrl: bestDoc.audioUrl || null,
      videoUrl: bestDoc.videoUrl || null,
      imageUrl: bestDoc.imageUrl || null
    });
  } catch (err) {
    console.error('Error in /ask:', err);
    res.status(500).json({ error: 'خطا در پاسخ به سوال' });
  }
});

// --- Admin APIs ---
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('خطا در دریافت کاربران:', err);
    res.status(500).json({ error: 'خطا در دریافت داده‌ها' });
  }
});

app.get('/api/messages/:userId', async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.params.userId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'خطا در دریافت پیام‌ها' });
  }
});

// --- Socket.IO real-time chat ---
io.on('connection', (socket) => {
  socket.on('registerUser', async (userId) => {
    if (!mongoose.isValidObjectId(userId)) {
      socket.emit('error', 'شناسه کاربر نامعتبر است');
      return;
    }
    socket.userId = userId;
  });

  socket.on('chat message', async (msg) => {
    try {
      const userId = socket.userId;
      if (!userId) {
        socket.emit('chat message', 'خطا: شناسه کاربر ثبت نشده یا نامعتبر است.');
        return;
      }

      await Message.create({ userId, sender: 'user', content: msg, type: 'text' });

      const questionEmbedding = await getEmbedding(msg);

      const docs = await Document.find();
      let bestDoc = null;
      let bestScore = 0;
      for (const doc of docs) {
        if (!doc.embedding || doc.embedding.length === 0) continue;
        const score = cosineSimilarity(questionEmbedding, doc.embedding);
        if (score > bestScore) {
          bestScore = score;
          bestDoc = doc;
        }
      }

      const threshold = 0.3;
      if (!bestDoc || bestScore < threshold) {
        socket.emit('chat message', 'در حیطه تخصص من نیست.');
        return;
      }

      const reply = await getOpenAIResponseWithContext(msg, bestDoc.content);

      await Message.create({ userId, sender: 'bot', content: reply, type: 'text' });

      socket.emit('chat message', reply);

      // Send media URLs if available
      if (bestDoc.audioUrl) socket.emit('audio reply', bestDoc.audioUrl);
      if (bestDoc.videoUrl) socket.emit('video reply', bestDoc.videoUrl);
      if (bestDoc.imageUrl) socket.emit('image reply', bestDoc.imageUrl);

      // Convert text reply to speech and send audio URL
      const audioUrl = await avangardTTS(reply);
      if (audioUrl) socket.emit('voice reply', audioUrl);

    } catch (err) {
      console.error('Error processing message:', err);
      socket.emit('chat message', 'خطا در پردازش پیام شما.');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
