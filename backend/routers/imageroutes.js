import { Router } from "express";
import fetch from 'node-fetch'; // Используем встроенный fetch вместо axios

const router = new Router();

// Прокси для изображений с Яндекс.Диска
// imageroutes.js
router.get('/yandex-proxy', async (req, res) => {
    try {
        const { imageUrl } = req.query;
        
        if (!imageUrl) {
            return res.status(400).json({ error: 'imageUrl parameter is required' });
        }

        const decodedUrl = decodeURIComponent(imageUrl);
        console.log('Proxying image URL:', decodedUrl);

        // Для публичных ссылок yadi.sk не нужна авторизация
        if (decodedUrl.includes('yadi.sk')) {
            const response = await fetch(decodedUrl);
            
            if (!response.ok) {
                throw new Error(`Yandex public response: ${response.status}`);
            }

            res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            response.body.pipe(res);
        } else {
            // Для других ссылок используем авторизацию
            const response = await fetch(decodedUrl, {
                headers: {
                    'Authorization': `OAuth ${process.env.YANDEX_DISK_ACCESS_TOKEN}`
                }
            });

            if (!response.ok) {
                throw new Error(`Yandex response: ${response.status}`);
            }

            res.setHeader('Content-Type', response.headers.get('content-type'));
            res.setHeader('Cache-Control', 'public, max-age=3600');
            response.body.pipe(res);
        }
    } catch (error) {
        console.error('Error proxying image:', error);
        res.status(500).json({ error: 'Failed to load image' });
    }
});

export default router;