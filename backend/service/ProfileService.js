import ApiError from '../error/ApiError.js';
import { models } from '../config/db.js';
import { promises as fs } from 'fs'; 
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '../uploads');
const { Profile, User } = models;

class ProfileService {
    async getProfile(userId) {
        const profile = await Profile.findOne({ where: { userId } });
        if (!profile) {
            throw ApiError.BadRequest('Профиль не найден');
        }
        return profile;
    }

    async updateProfile(userId, { birthDate, bio, photo }) {
        const profile = await Profile.findOne({ where: { userId } });
        if (!profile) {
            throw ApiError.BadRequest('Профиль не найден');
        }

        // Явная проверка на undefined (null и '' будут обработаны)
        if (birthDate !== undefined) {
            profile.birthDate = birthDate === '' ? null : birthDate;
        }
        if (bio !== undefined) profile.bio = bio;
        if (photo !== undefined) profile.photo = photo;

        await profile.save();
        return {
            birthDate: profile.birthDate,
            bio: profile.bio,
            photo: profile.photo
        };
    }

    async uploadPhoto(userId, file) {
        if (!file) {
            throw ApiError.BadRequest('Файл не загружен');
        }

        // 1. Получаем текущий профиль
        const profile = await Profile.findOne({ where: { userId } });
        if (!profile) {
            throw ApiError.BadRequest('Профиль не найден');
        }

        // 2. Удаляем старое фото (если есть)
        if (profile.photo) {
            await this.deletePhotoFile(profile.photo);
        }

        // 3. Генерация уникального имени файла
        const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        const photoPath = `/uploads/${uniqueFilename}`;
        const absolutePath = path.join(UPLOADS_DIR, uniqueFilename);

        // 4. Создаем папку uploads если не существует
        await fs.mkdir(UPLOADS_DIR, { recursive: true });
        // 5. Перемещаем файл из временной папки в целевую
        try {
            await fs.rename(file.path, absolutePath);
        } catch (error) {
            console.error('Ошибка перемещения файла:', error);
            throw ApiError.Internal('Ошибка сохранения файла');
        }

        // 6. Обновляем профиль с новым фото
        const updatedProfile = await this.updateProfile(userId, { photo: photoPath });

        
        return { 
            photoUrl: photoPath,
            birthDate: updatedProfile.birthDate,
            bio: updatedProfile.bio
        };
    }
    async deletePhotoFile(photoPath) {
    try {
        const filename = path.basename(photoPath);
        const absolutePath = path.join(UPLOADS_DIR, filename);
        
        try {
            // Используем fs.promises API
            await fs.access(absolutePath); // Проверяем доступ к файлу
            await fs.unlink(absolutePath);
            console.log(`Файл удален: ${absolutePath}`);
        } catch (accessError) {
            if (accessError.code === 'ENOENT') {
                console.warn(`Файл не найден: ${absolutePath}`);
            } else {
                throw accessError;
            }
        }
    } catch (error) {
        console.error('Ошибка при удалении файла:', error);
        // Не прерываем выполнение, если не удалось удалить файл
    }
}

    async deletePhoto(userId) {
        const profile = await Profile.findOne({ where: { userId } });
        if (!profile) {
            throw ApiError.BadRequest('Профиль не найден');
        }

        if (profile.photo) {
            await this.deletePhotoFile(profile.photo);
        }

        // Обновляем профиль, устанавливая photo в null
        const updatedProfile = await this.updateProfile(userId, { photo: null });

        return {
            photoUrl: null,
            birthDate: updatedProfile.birthDate,
            bio: updatedProfile.bio
        };
    }

    async clearBirthDate(userId) {
        return await this.updateProfile(userId, { birthDate: null });
    }
    async getUserProfile(userId) {
        const parsedUserId = parseInt(userId);
        if (isNaN(parsedUserId)) {
            throw ApiError.BadRequest('Неверный идентификатор пользователя');
        }

        const profile = await Profile.findOne({ 
            where: { userId: parsedUserId },
            include: [{ 
            model: User, 
            attributes: ['id', 'nickname'],
            required: true // Гарантируем, что пользователь существует
            }]
        });
        
        if (!profile) {
            throw ApiError.NotFound('Профиль не найден');
        }

    return {
        nickname: profile.User.nickname,
        birthDate: profile.birthDate,
        bio: profile.bio,
        photo: profile.photo
    };
    }
}

export default new ProfileService();