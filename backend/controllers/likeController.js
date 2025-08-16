import LikeService from "../service/LikeService.js";

import { models } from "../config/db.js";
const {Post, Comment}=models

class LikeController {
    async createPostLike(req, res, next) {
        try {
            const { postId } = req.params;
            const userId = req.user.id;
            
            const like = await LikeService.createPostLike(userId, postId);
            const post = await Post.findByPk(postId);
            
            return res.status(201).json({
                like,
                likesCount: post.likesCount
            });
        } catch(e) {
            if (e.message === 'Вы уже поставили лайк этому посту') {
                return res.status(400).json({ message: e.message });
            }
            next(e);
        }
    }

    async deletePostLike(req, res, next) {
        try {
            const { postId } = req.params;
            const userId = req.user.id;
            
            const result = await LikeService.deletePostLike(userId, postId);
            const post = await Post.findByPk(postId);
            
            return res.status(200).json({
                ...result,
                likesCount: post.likesCount
            });
        } catch(e) {
            if (e.message === 'Лайк не найден') {
                return res.status(404).json({ message: e.message });
            }
            next(e);
        }
    }

    async getUserLikes(req, res, next) {
        try {
            const userId = req.user.id;
            const likes = await LikeService.getUserLikes(userId);
            return res.json(likes);
        } catch(e) {
            next(e);
        }
    }
   

    async createCommentLike(req, res, next) {
        try {
            const { commentId } = req.params;
            const userId = req.user.id;
            
            const numericCommentId = Number(commentId);
            if (isNaN(numericCommentId)) {
                return res.status(400).json({ message: 'Неверный ID комментария' });
            }

            const like = await LikeService.createCommentLike(userId, numericCommentId);
            const comment = await Comment.findByPk(numericCommentId);
            
            return res.status(201).json({
                like,
                likesCount: comment.likesCount
            });
        } catch(e) {
            if (e.message === 'Вы уже поставили лайк этому комментарию' || 
                e.message === 'Комментарий не найден') {
                return res.status(400).json({ message: e.message });
            }
            next(e);
        }
    }

    async deleteCommentLike(req, res, next) {
        try {
            const { commentId } = req.params;
            const userId = req.user.id;
            
            const result = await LikeService.deleteCommentLike(userId, commentId);
            const comment = await Comment.findByPk(commentId);
            
            return res.status(200).json({
                ...result,
                likesCount: comment.likesCount
            });
        } catch(e) {
            if (e.message === 'Лайк не найден') {
                return res.status(404).json({ message: e.message });
            }
            next(e);
        }
    }

    async getUserLikesComments(req, res, next) {
        try {
            const userId = req.user.id;
            const likes = await LikeService.getUserLikesComments(userId);
            return res.json(likes);
        } catch(e) {
            next(e);
        }
    }
}


export default new LikeController();