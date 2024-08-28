import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const dirPath = path.join(process.cwd(), 'public/images/backgrounds');

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read directory' });
    }

    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));

    if (imageFiles.length === 0) {
      return res.status(404).json({ error: 'No images found in directory' });
    }

    const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
    const imagePath = `/images/backgrounds/${randomImage}`;
    res.status(200).json({ imagePath });
  });
}
