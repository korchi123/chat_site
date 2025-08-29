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
        
        // Просто редиректим на оригинальный URL
        return res.redirect(decodedUrl);
        
    } catch (error) {
        console.error('Error in yandex-proxy:', error);
        res.status(500).json({ error: 'Failed to load image' });
    }
});

export default router;