import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();
const uploadsDir = path.join(process.cwd(), 'uploads');

// Utility to sanitize filename (prevent directory traversal)
function sanitizeFilename(filename) {
  return path.basename(filename);
}

// List all uploaded files with type detection
router.get('/files', async (req, res) => {
  try {
    const files = await fs.readdir(uploadsDir);
    const fileInfos = files.map(filename => {
      const ext = path.extname(filename).toLowerCase();
      let type = 'other';
      if (['.mp3', '.wav', '.ogg'].includes(ext)) type = 'audio';
      else if (['.mp4', '.avi', '.mov', '.webm'].includes(ext)) type = 'video';
      else if (['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(ext)) type = 'image';
      else if (['.txt', '.json', '.csv'].includes(ext)) type = 'text';
      return { filename, type };
    });
    res.json(fileInfos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در خواندن فایل‌ها' });
  }
});

// Upload file (used by your existing /upload route)
router.post('/upload', async (req, res) => {
  res.status(405).json({ error: 'Use the main upload route' });
});

// Delete a file by filename
router.delete('/files/:filename', async (req, res) => {
  try {
    const filename = sanitizeFilename(req.params.filename);
    const filePath = path.join(uploadsDir, filename);
    await fs.unlink(filePath);
    res.json({ message: 'فایل با موفقیت حذف شد' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در حذف فایل' });
  }
});

export default router;
