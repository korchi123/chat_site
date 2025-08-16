import { Router } from "express";
import authMiddleware from '../middleware.js/authMiddleware.js'
import profileController from "../controllers/profileController.js";
import uploadPhoto from "../middleware.js/uploadPhoto.js";

const router = Router();

// Получить профиль

router.get('/', authMiddleware, profileController.getProfile);

// Обновить биографию
router.patch('/bio', authMiddleware, profileController.updateBio);

// Обновить дату рождения
router.patch('/birthdate', authMiddleware, profileController.updateBirthDate);

// Загрузить фото
router.post('/upload-photo', authMiddleware, uploadPhoto.single('photo'), profileController.uploadPhoto);
router.delete('/photo', authMiddleware, profileController.deletePhoto);
router.get('/user/:userId', authMiddleware, profileController.getUserProfile);

export default router;