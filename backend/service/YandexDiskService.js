import fetch from 'node-fetch';
import fs from 'fs';
import ApiError from '../error/ApiError.js';

class YandexDiskService {
    constructor() {
        this.baseUrl = 'https://cloud-api.yandex.net/v1/disk';
        this.accessToken = process.env.YANDEX_DISK_ACCESS_TOKEN;
    }

    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        try {
            console.log(`Making request to: ${url}`);
            
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Authorization': `OAuth ${this.accessToken}`,
                    'Accept': 'application/json',
                    ...options.headers
                }
            });

            const responseText = await response.text();
            console.log(`Response status: ${response.status}, body: ${responseText}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('NotFound');
                }
                
                throw new Error(`Yandex Disk API error: ${response.status} - ${responseText}`);
            }

            return responseText ? JSON.parse(responseText) : {};
        } catch (error) {
            if (error.message === 'NotFound') {
                throw error;
            }
            console.error('Network error in Yandex Disk request:', error);
            throw error;
        }
    }

    async ensureUploadsFolder() {
        if (!this.accessToken) return;
        
        try {
            await this.makeRequest('/resources?path=/uploads');
            console.log('Uploads folder exists on Yandex Disk');
        } catch (error) {
            if (error.message === 'NotFound') {
                // Папка не существует, создаем ее
                console.log('Creating uploads folder on Yandex Disk');
                await this.makeRequest('/resources?path=/uploads', {
                    method: 'PUT'
                });
            } else {
                throw error;
            }
        }
    }

    async uploadFile(file, fileName) {
        if (!this.accessToken) {
            console.warn('YANDEX_DISK_ACCESS_TOKEN not found. Using mock mode.');
            return {
                publicUrl: `https://example.com/mock-uploads/${fileName}`
            };
        }

        try {
            console.log('Starting file upload to Yandex Disk...');
            
            // Создаем папку uploads если нужно
            await this.ensureUploadsFolder();

            // 1. Получаем URL для загрузки
            const uploadData = await this.makeRequest(
                `/resources/upload?path=/uploads/${fileName}&overwrite=true`
            );

            console.log('Got upload URL:', uploadData.href);

            // 2. Читаем файл
            const fileBuffer = await fs.promises.readFile(file.path);
            console.log('File read successfully, size:', fileBuffer.length);

            // 3. Загружаем файл на полученный URL
            const uploadResponse = await fetch(uploadData.href, {
                method: 'PUT',
                body: fileBuffer,
                headers: {
                    'Content-Type': 'application/octet-stream'
                }
            });

            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                throw new Error(`Upload failed: ${uploadResponse.status} - ${errorText}`);
            }

            console.log('File uploaded successfully, now publishing...');

            // 4. Публикуем файл
            await this.makeRequest(
                `/resources/publish?path=/uploads/${fileName}`,
                { method: 'PUT' }
            );

            console.log('File published, getting public URL...');

            // 5. Получаем информацию о файле
            await new Promise(resolve => setTimeout(resolve, 2000));

            const fileInfo = await this.makeRequest(
                `/resources?path=/uploads/${fileName}`
            );

            console.log('File info:', fileInfo);

            // 6. Используем прямую ссылку на файл вместо публичной ссылки на папку
            let imageUrl = null;
            
            // Попробуем найти прямую ссылку на изображение
            if (fileInfo.sizes && fileInfo.sizes.length > 0) {
                // Берем ссылку размера "ORIGINAL" или первую доступную
                const originalSize = fileInfo.sizes.find(size => size.name === 'ORIGINAL');
                imageUrl = originalSize ? originalSize.url : fileInfo.sizes[0].url;
            }
            
            // Если не нашли в sizes, используем прямую ссылку из file
            if (!imageUrl && fileInfo.file) {
                imageUrl = fileInfo.file;
            }
            
            // Если все еще нет, используем public_url как запасной вариант
            if (!imageUrl) {
                imageUrl = fileInfo.public_url;
            }

            console.log('Selected image URL:', imageUrl);

            if (!imageUrl) {
                throw new Error('No image URL received from Yandex Disk');
            }

            return {
                publicUrl: imageUrl
            };

        } catch (error) {
            console.error('Error uploading to Yandex Disk:', error);
            throw ApiError.BadRequest('Ошибка загрузки файла на Яндекс.Диск');
        }
    }

    async deleteFile(fileName) {
        if (!this.accessToken) {
            console.warn('Skip delete - no token');
            return;
        }

        try {
            await this.makeRequest(
                `/resources?path=/uploads/${fileName}`,
                { method: 'DELETE' }
            );
            console.log(`File ${fileName} deleted from Yandex Disk`);
        } catch (error) {
            if (error.message === 'NotFound') {
                console.warn(`File ${fileName} not found on Yandex Disk, skipping delete`);
                return;
            }
            console.error('Error deleting file from Yandex Disk:', error);
            throw error;
        }
    }

    extractFileNameFromUrl(url) {
        if (!url) return null;
        
        try {
            console.log('Extracting filename from URL:', url);
            
            // Для прямых ссылок скачивания Яндекс.Диска
            // Пример: https://downloader.disk.yandex.ru/disk/...&filename=test.png&...
            if (url.includes('downloader.disk.yandex.ru')) {
                const urlObj = new URL(url);
                const filenameParam = urlObj.searchParams.get('filename');
                if (filenameParam) {
                    console.log('Extracted filename from URL params:', filenameParam);
                    return filenameParam;
                }
            }
            
            // Для публичных ссылок вида: https://yadi.sk/i/filename.jpg
            if (url.includes('yadi.sk/i/')) {
                const urlObj = new URL(url);
                const pathname = urlObj.pathname;
                const filename = pathname.split('/').pop();
                console.log('Extracted filename from yadi.sk:', filename);
                return filename;
            }
            
            // Для ссылок вида: https://disk.yandex.ru/client/disk/filename.jpg
            if (url.includes('disk.yandex.')) {
                const urlObj = new URL(url);
                const pathParts = urlObj.pathname.split('/');
                const filename = pathParts[pathParts.length - 1];
                console.log('Extracted filename from disk.yandex:', filename);
                return filename;
            }
            
            // Пытаемся извлечь имя файла из любого URL
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const match = pathname.match(/\/([^\/]+\.[a-zA-Z0-9]+)$/);
            const filename = match ? match[1] : null;
            
            console.log('Extracted filename from generic URL:', filename);
            return filename;
            
        } catch (error) {
            console.error('Error extracting filename from URL:', error);
            return null;
        }
    }
}

export default new YandexDiskService();
