import { Router } from "express";
import authMiddleware from "../middleware.js/authMiddleware.js";
import likeController from "../controllers/likeController.js";
const router=new Router()

router.post('/posts/:postId/likes', authMiddleware, likeController.createPostLike);
router.delete('/posts/:postId/likes', authMiddleware, likeController.deletePostLike);

router.get('/posts/my', authMiddleware, likeController.getUserLikes);

// Лайки комментариев
router.post('/comments/:commentId/likes', authMiddleware, likeController.createCommentLike);
router.delete('/comments/:commentId/likes', authMiddleware, likeController.deleteCommentLike);
router.get('/comments/my', authMiddleware, likeController.getUserLikesComments);


export default router




