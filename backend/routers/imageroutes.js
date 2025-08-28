// routes/image.js
import express from 'express';
import axios from 'axios';
import { YANDEX_DISK_ACCESS_TOKEN } from '../config.js';

const router = express.Router();

router.get('/yandex-image', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    const response = await axios.get(url, {
      headers: {
        'Authorization': `OAuth ${YANDEX_DISK_ACCESS_TOKEN}`
      },
      responseType: 'stream'
    });

    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (error) {
    console.error('Error proxying image:', error);
    res.status(500).json({ error: 'Failed to load image' });
  }
});

export default router;