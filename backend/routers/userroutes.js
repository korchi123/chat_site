import { Router } from "express";
import userController from "../controllers/userController.js";
import { body } from "express-validator";
import authMiddleware from "../middleware.js/authMiddleware.js";
const router=new Router()

router.post('/registration', body('email').isEmail(), body('password').isLength({min:3, max:32}), userController.registration);
router.get('/activate/:link', userController.activate)
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.post('/delete/request', authMiddleware, userController.requestAccountDeletion); // Запрос на удаление (отправка кода)
router.post('/delete/confirm', authMiddleware, userController.confirmAccountDeletion); // Подтверждение удаления по коду
router.post('/resendactivation', userController.resendActivation);


export default router
