import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

import { getEmbedding } from './embedding.js';
import Document from './models/Document.js'; // فرض بر این است که مدل Document دارید
import { detectLanguage } from './utils.js'; // تابعی که زبان متن را تشخیص می‌دهد

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const uploadDir = path.join(__dirname, 'uploads');

// ساخت پوشه uploads در صورت عدم وجود
import fsSync from 'fs';
if (!fsSync.existsSync(uploadDir)) {
  fsSync.mkdirSync(uploadDir);
}

// تنظیمات Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const allowedTypes = [
  '.txt', '.json', '.mp3', '.wav', '.jpg', '.jpeg', '.png', '.gif', '.mp4', '.avi', '.mov'
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) cb(null, true);
  else cb(new Error('فرمت فایل مجاز نیست'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 100 * 1024 * 1024 } });

// API دریافت لیست فایل‌ها
app.get('/files', async (req, res) => {
  try {
    const files = await fs.readdir(uploadDir);
    const fileList = files.map(filename => {
      const ext = path.extname(filename).toLowerCase();
      let type = 'other';
      if (['.mp3', '.wav'].includes(ext)) type = 'audio';
      else if (['.mp4', '.avi', '.mov'].includes(ext)) type = 'video';
      else if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) type = 'image';
      else if (['.txt', '.json'].includes(ext)) type = 'text';
      return { filename, type };
    });
    res.json(fileList);
  } catch (err) {
    res.status(500).json({ error: 'خطا در خواندن فایل‌ها' });
  }
});

// API حذف فایل
app.delete('/files/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    // جلوگیری از مسیرهای مخرب
    if (filename.includes('..')) return res.status(400).json({ error: 'نام فایل نامعتبر است' });

    const filePath = path.join(uploadDir, filename);
    await fs.unlink(filePath);
    res.json({ message: 'فایل حذف شد' });
  } catch (err) {
    res.status(404).json({ error: 'فایل پیدا نشد' });
  }
});

// API آپلود فایل و پردازش (یک مسیر برای همه فایل‌ها)
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'فایلی ارسال نشده است' });

  const filePath = path.join(uploadDir, req.file.filename);
  const ext = path.extname(req.file.originalname).toLowerCase();

  try {
    if (ext === '.txt' || ext === '.json') {
      const content = await fs.readFile(filePath, 'utf8');
      const lang = detectLanguage(content);
      const embedding = await getEmbedding(content);
      await Document.create({ filename: req.file.filename, content, language: lang, embedding });
    }
    // برای فایل‌های صوتی، تصویری، ویدئو می‌توانید در آینده پردازش اضافه کنید
    res.json({ message: 'فایل با موفقیت آپلود و پردازش شد', filename: req.file.filename });
  } catch (err) {
    console.error('خطا در پردازش فایل:', err);
    res.status(500).json({ error: 'خطا در پردازش فایل' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`سرور روی پورت ${PORT} در حال اجرا است`);
});
