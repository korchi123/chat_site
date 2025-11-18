import { makeAutoObservable } from 'mobx';
import { $authHost } from '../http/index';
import { toast } from 'react-toastify';

export default class ProfileStore {
    constructor() {
        this._birthDate = '';
        this._bio = '';
        this._photo = '';
        this._isLoading = false;
        this._isSavingBio = false;
        this._isSavingBirthDate = false;
        this._userProfile = null;
        makeAutoObservable(this);
    }

    // Геттеры
    get birthDate() {
        return this._birthDate;
    }

    get bio() {
        return this._bio;
    }

    get photo() {
        return this._photo;
    }

    get isLoading() {
        return this._isLoading;
    }

    get isSavingBio() {
        return this._isSavingBio;
    }

    get isSavingBirthDate() {
        return this._isSavingBirthDate;
    }

    get userProfile() {
        return this._userProfile;
    }

    // Сеттеры
    setBirthDate(date) {
        this._birthDate = date;
    }

    setBio(text) {
        this._bio = text;
    }

    setPhoto(photoUrl) {
        this._photo = photoUrl;
    }

    setIsLoading(loading) {
        this._isLoading = loading;
    }

    setIsSavingBio(saving) {
        this._isSavingBio = saving;
    }

    setIsSavingBirthDate(saving) {
        this._isSavingBirthDate = saving;
    }

    setUserProfile(userProfile) {
        this._userProfile = userProfile;
    }

    // Метод для получения проксированного URL изображения
    getProxiedImageUrl(originalUrl) {
        if (!originalUrl) return '';
        
        // Если это URL Яндекс.Диска, используем прокси
        if (originalUrl.includes('disk.yandex.ru') || originalUrl.includes('yadi.sk')) {
            const encodedUrl = encodeURIComponent(originalUrl);
            return `${process.env.REACT_APP_API_URL}/api/images/yandex-proxy?imageUrl=${encodedUrl}`;
        }
        
        // Если это уже полный URL (http/https), возвращаем как есть
        if (originalUrl.startsWith('http://') || originalUrl.startsWith('https://')) {
            return originalUrl;
        }
        
        // Для base64 и относительных путей
        if (originalUrl.startsWith('data:') || originalUrl.includes('/api/images/')) {
            return originalUrl;
        }
        
        // По умолчанию используем прокси
        const encodedUrl = encodeURIComponent(originalUrl);
        return `${process.env.REACT_APP_API_URL}/api/images/yandex-proxy?imageUrl=${encodedUrl}`;
    }

    // Методы для работы с API
    async uploadPhoto(file) {
        try {
            this.setIsLoading(true);
            
            const formData = new FormData();
            formData.append('photo', file);
            
            const { data } = await $authHost.post('/profile/upload-photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            this.setPhoto(data.photoUrl);
            toast.success('Фото успешно обновлено');
            return data;
        } catch (error) {
            toast.error('Ошибка при загрузке фото');
            throw error;
        } finally {
            this.setIsLoading(false);
        }
    }

    async deletePhoto() {
        try {
            this.setIsLoading(true);
            const { data } = await $authHost.delete('/profile/photo');
            this.setPhoto(''); // Очищаем фото в хранилище
            toast.success('Фотография удалена');
            return data;
        } catch (error) {
            toast.error('Ошибка при удалении фотографии');
            throw error;
        } finally {
            this.setIsLoading(false);
        }
    }

    async saveBio() {
        try {
            this.setIsSavingBio(true);
            
            const { data } = await $authHost.patch('/profile/bio', {
                bio: this._bio
            });
            
            toast.success('Биография сохранена');
            return data;
        } catch (error) {
            toast.error('Ошибка при сохранении биографии');
            throw error;
        } finally {
            this.setIsSavingBio(false);
        }
    }

    async saveBirthDate() {
        try {
            this.setIsSavingBirthDate(true);
            
            const { data } = await $authHost.patch('/profile/birthdate', {
                birthDate: this._birthDate
            });
            
            toast.success('Дата рождения сохранена');
            return data;
        } catch (error) {
            toast.error('Ошибка при сохранении даты рождения');
            throw error;
        } finally {
            this.setIsSavingBirthDate(false);
        }
    }

    async loadProfile() {
        try {
            this.setIsLoading(true);
            const { data } = await $authHost.get('/profile');
            this.setBirthDate(data.birthDate || '');
            this.setBio(data.bio || '');
            this.setPhoto(data.photo || '');
        } catch (error) {
            console.error('Ошибка загрузки профиля:', error);
            toast.error('Ошибка при загрузке профиля');
        } finally {
            this.setIsLoading(false);
        }
    }

    async loadUserProfile(userId) {
        // 1. Проверка входных параметров
        const parsedUserId = Number(userId);
        if (isNaN(parsedUserId)) {
            console.error('Invalid user ID:', userId);
            this.setUserProfile(null);
            return;
        }

        this.setIsLoading(true);
        this.setUserProfile(null); // Сбрасываем перед загрузкой
        
        try {
            const { data } = await $authHost.get(`/profile/user/${parsedUserId}`);
            
            // 2. Проверка ответа сервера
            if (!data) {
                throw new Error('Empty response from server');
            }
            
            this.setUserProfile({
                id: data.id,
                nickname: data.nickname || 'Неизвестный',
                birthDate: data.birthDate || null,
                bio: data.bio || null,
                photo: data.photo || null
            });
            
        } catch (error) {
            console.error('Ошибка загрузки профиля пользователя:', error);
            this.setUserProfile(null);
            toast.error('Не удалось загрузить профиль пользователя');
        } finally {
            this.setIsLoading(false);
        }
    }
}