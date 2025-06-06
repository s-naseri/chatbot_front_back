import fs from 'fs/promises';
import path from 'path';
import Document from './models/Document.js';
import { getEmbedding } from './embedding.js';

const uploadsDir = path.join(process.cwd(), 'uploads');

async function processFile(filename) {
  const ext = path.extname(filename).toLowerCase();

  // فقط فایل‌های متنی را پردازش می‌کنیم (txt، md، ...). در صورت نیاز می‌توانید فرمت‌های دیگر را اضافه کنید.
  const textFileExtensions = ['.txt', '.md', '.json', '.csv'];

  if (!textFileExtensions.includes(ext)) {
    console.log(`فایل ${filename} از نوع متنی نیست و پردازش نمی‌شود.`);
    return;
  }

  try {
    const filePath = path.join(uploadsDir, filename);
    const content = await fs.readFile(filePath, 'utf-8');

    // بررسی اینکه آیا فایل قبلا در دیتابیس ثبت شده است یا نه
    const existingDoc = await Document.findOne({ filename });
    if (existingDoc) {
      console.log(`فایل ${filename} قبلا پردازش شده است.`);
      return;
    }

    const embedding = await getEmbedding(content);

    const doc = new Document({
      filename,
      content,
      language: 'fa', // یا زبان مناسب را تنظیم کنید
      embedding,
      audioUrl: '',
      videoUrl: '',
      imageUrl: '',
    });

    await doc.save();
    console.log(`فایل ${filename} با موفقیت اضافه شد.`);
  } catch (err) {
    console.error(`خطا در پردازش فایل ${filename}:`, err);
  }
}

async function processAllFiles() {
  try {
    const files = await fs.readdir(uploadsDir);
    for (const file of files) {
      await processFile(file);
    }
    console.log('پردازش تمام فایل‌ها به پایان رسید.');
  } catch (err) {
    console.error('خطا در خواندن پوشه uploads:', err);
  }
}

// اجرای اسکریپت
processAllFiles();
