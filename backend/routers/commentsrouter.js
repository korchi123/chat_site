import { Router } from "express";
import commentController from "../controllers/commentController.js";
import authMiddleware from "../middleware.js/authMiddleware.js";
const router = new Router();

// Комментарии
router.post('/post/:postId', authMiddleware, commentController.createComment); // Уточненный путь
router.delete('/:id', authMiddleware, commentController.deleteComment);
router.get('/post/:postId', commentController.getForPost); // Получение по postId

export default router;
