import ApiError from '../error/ApiError.js';
import { models } from '../config/db.js';
import { promises as fs } from 'fs'; 
import path from 'path';

import YandexDiskService from './YandexDiskService.js';




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

        if (birthDate !== undefined) {
            profile.birthDate = birthDate === '' ? null : birthDate;
        }
        if (bio !== undefined) profile.bio = bio;
        if (photo !== undefined) profile.photo = photo;

        await profile.save();
        return profile;
    }

    async uploadPhoto(userId, file) {
        if (!file) {
            throw ApiError.BadRequest('Файл не загружен');
        }

        const profile = await Profile.findOne({ where: { userId } });
        if (!profile) {
            throw ApiError.BadRequest('Профиль не найден');
        }

        // Удаляем старое фото (если есть)
        if (profile.photo) {
            await this.deletePhotoFromDisk(profile.photo);
        }

        // Генерация уникального имени файла
        const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;

        // Загружаем файл на Яндекс.Диск
        const diskResponse = await YandexDiskService.uploadFile(file, uniqueFilename);

        // Обновляем профиль
        const updatedProfile = await this.updateProfile(userId, {
            photo: diskResponse.publicUrl
        });

        // Удаляем временный файл
        await fs.unlink(file.path).catch(console.error);

        return { 
            photoUrl: updatedProfile.photo,
            birthDate: updatedProfile.birthDate,
            bio: updatedProfile.bio
        };
    }

    async deletePhotoFromDisk(photoUrl) {
        try {
            console.log('Attempting to delete photo from disk. URL:', photoUrl);
            
            // Извлекаем имя файла из URL
            const fileName = YandexDiskService.extractFileNameFromUrl(photoUrl);
            console.log('Extracted filename:', fileName);
            
            if (fileName) {
                console.log('Calling deleteFile for:', fileName);
                await YandexDiskService.deleteFile(fileName);
                console.log('File deleted successfully');
            } else {
                console.warn('Could not extract filename from URL');
            }
        } catch (error) {
            // Игнорируем ошибки удаления, так как это не критично
            console.warn('Error deleting photo from Yandex Disk (non-critical):', error.message);
        }
    }

    async deletePhoto(userId) {
        const profile = await Profile.findOne({ where: { userId } });
        if (!profile) {
            throw ApiError.BadRequest('Профиль не найден');
        }

        if (profile.photo) {
            await this.deletePhotoFromDisk(profile.photo);
        }

        // Обновляем профиль
        const updatedProfile = await this.updateProfile(userId, {
            photo: null
        });

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