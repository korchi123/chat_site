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

        let response;
        
        // Для публичных ссылок yadi.sk
        if (decodedUrl.includes('yadi.sk')) {
            response = await fetch(decodedUrl);
            
            if (!response.ok) {
                throw new Error(`Yandex public response: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            
            // Если yadi.sk возвращает HTML, значит это страница с изображением
            if (contentType && contentType.includes('text/html')) {
                console.log('yadi.sk returned HTML, extracting direct image URL');
                
                // Парсим HTML чтобы найти прямую ссылку на изображение
                const html = await response.text();
                const imageMatch = html.match(/<img[^>]+src="([^">]+)"/i);
                
                if (imageMatch && imageMatch[1]) {
                    const directImageUrl = imageMatch[1];
                    console.log('Found direct image URL:', directImageUrl);
                    
                    // Загружаем само изображение
                    response = await fetch(directImageUrl);
                    if (!response.ok) {
                        throw new Error(`Direct image response: ${response.status}`);
                    }
                } else {
                    throw new Error('Could not find image in yadi.sk HTML');
                }
            }
        } else {
            // Для других ссылок используем авторизацию
            response = await fetch(decodedUrl, {
                headers: {
                    'Authorization': `OAuth ${process.env.YANDEX_DISK_ACCESS_TOKEN}`
                }
            });

            if (!response.ok) {
                throw new Error(`Yandex response: ${response.status}`);
            }
        }

        res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        response.body.pipe(res);
        
    } catch (error) {
        console.error('Error proxying image:', error);
        res.status(500).json({ error: 'Failed to load image' });
    }
});

export default router;