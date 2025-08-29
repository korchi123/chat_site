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

        const filePath = `/uploads/${fileName}`;

        // 1. Получаем URL для загрузки
        const uploadData = await this.makeRequest(
            `/resources/upload?path=${filePath}&overwrite=true`
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

        // 4. Публикуем файл (делаем общедоступным)
        await this.makeRequest(
            `/resources/publish?path=${filePath}`,
            { method: 'PUT' }
        );

        console.log('File published, getting public URL...');

        // 5. Ждем немного перед получением информации
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 6. Получаем информацию о файле с публичной ссылкой
        const fileInfo = await this.makeRequest(
            `/resources?path=${filePath}&fields=public_url`
        );

        console.log('File info with public_url:', fileInfo);

        // 7. Используем ТОЛЬКО публичную ссылку
        if (!fileInfo.public_url) {
            throw new Error('No public URL received from Yandex Disk');
        }

        console.log('Public URL:', fileInfo.public_url);

        return {
            publicUrl: fileInfo.public_url
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
            
            // Для публичных ссылок yadi.sk: https://yadi.sk/i/abc123def456
            if (url.includes('yadi.sk/i/')) {
                const urlObj = new URL(url);
                const pathname = urlObj.pathname;
                const filename = pathname.split('/').pop();
                console.log('Extracted filename from yadi.sk:', filename);
                return filename;
            }
            
            // Для других типов ссылок Яндекс.Диска
            if (url.includes('yadi.sk') || url.includes('disk.yandex')) {
                // Пытаемся извлечь имя файла из любого URL Яндекс.Диска
                const urlObj = new URL(url);
                const pathname = urlObj.pathname;
                
                // Для ссылок вида: /disk/filename.jpg
                const match = pathname.match(/\/([^\/]+\.[a-zA-Z0-9]+)$/);
                const filename = match ? match[1] : null;
                
                console.log('Extracted filename from Yandex URL:', filename);
                return filename;
            }
            
            console.warn('Unsupported URL type for filename extraction');
            return null;
            
        } catch (error) {
            console.error('Error extracting filename from URL:', error);
            return null;
        }
    }
}

export default new YandexDiskService();
