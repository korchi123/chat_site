import { Router } from "express";
import fetch from 'node-fetch'; // Используем встроенный fetch вместо axios

const router = new Router();

// Прокси для изображений с Яндекс.Диска
router.get('/yandex-proxy', async (req, res) => {
    try {
        const { imageUrl } = req.query;
        
        if (!imageUrl) {
            return res.status(400).json({ error: 'imageUrl parameter is required' });
        }

        const decodedUrl = decodeURIComponent(imageUrl);
        
        const response = await fetch(decodedUrl, {
            headers: {
                'Authorization': `OAuth ${process.env.YANDEX_DISK_ACCESS_TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error(`Yandex response: ${response.status}`);
        }

        // Устанавливаем правильные заголовки
        res.setHeader('Content-Type', response.headers.get('content-type'));
        res.setHeader('Cache-Control', 'public, max-age=86400');

        // Передаем поток данных
        response.body.pipe(res);
    } catch (error) {
        console.error('Error proxying image:', error);
        res.status(500).json({ error: 'Failed to load image' });
    }
});

export default router;