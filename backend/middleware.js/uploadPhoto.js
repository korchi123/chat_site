import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import ApiError from '../error/ApiError.js';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TMP_DIR = path.join(__dirname, '../tmp');

// Создаем временную папку при инициализации
(async () => {
    try {
        await fs.mkdir(TMP_DIR, { recursive: true });
        console.log(`Временная папка создана: ${TMP_DIR}`);
    } catch (err) {
        console.error('Ошибка создания временной папки:', err);
    }
})();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, TMP_DIR);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(ApiError.BadRequest('Допустимы только изображения (JPEG, PNG, GIF)'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

export default upload;