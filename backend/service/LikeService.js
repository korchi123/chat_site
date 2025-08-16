import { models } from '../config/db.js';
const { PostLike, Post, CommentLike, Comment } = models;

class LikeService {
    async createPostLike(userId, postId) {
        try {
            // Проверяем, не поставил ли уже пользователь лайк
            const existingLike = await PostLike.findOne({
                where: { userId, postId }
            });

            if (existingLike) {
                throw new Error('Вы уже поставили лайк этому посту');
            }

            // Создаем лайк и увеличиваем счетчик
            const newLike = await PostLike.create({ userId, postId });
            await Post.increment('likesCount', { 
                where: { id: postId } 
            });
            
            return newLike;
        } catch(e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                throw new Error('Вы уже поставили лайк этому посту');
            }
            throw e;
        }
    }

    async deletePostLike(userId, postId) {
        try {
            // Удаляем лайк и уменьшаем счетчик
            const deleted = await PostLike.destroy({
                where: { userId, postId }
            });

            if (!deleted) {
                throw new Error('Лайк не найден');
            }

            await Post.decrement('likesCount', { 
                where: { id: postId } 
            });
            
            return { message: 'Лайк удален' };
        } catch(e) {
            throw e;
        }
    }

    async getUserLikes(userId) {
        try {
            return await PostLike.findAll({
                where: { userId },
                attributes: ['postId']
            });
        } catch(e) {
            throw e;
        }
    }
    

    async createCommentLike(userId, commentId) {
        try {
            // Проверяем существование комментария
            const comment = await Comment.findByPk(commentId);
            if (!comment) {
                throw new Error('Комментарий не найден');
            }

            // Проверяем, не поставил ли уже пользователь лайк
            const existingLike = await CommentLike.findOne({
                where: { userId, commentId }
            });

            if (existingLike) {
                throw new Error('Вы уже поставили лайк этому комментарию');
            }

            // Создаем лайк и увеличиваем счетчик
            const newLike = await CommentLike.create({ userId, commentId });
            await Comment.increment('likesCount', { 
                where: { id: commentId } 
            });
            
            return newLike;
        } catch(e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                throw new Error('Вы уже поставили лайк этому комментарию');
            }
            throw e;
        }
    }

    async deleteCommentLike(userId, commentId) {
        try {
            // Удаляем лайк и уменьшаем счетчик
            const deleted = await CommentLike.destroy({
                where: { userId, commentId }
            });

            if (!deleted) {
                throw new Error('Лайк не найден');
            }

            await Comment.decrement('likesCount', { 
                where: { id: commentId } 
            });
            
            return { message: 'Лайк удален' };
        } catch(e) {
            throw e;
        }
    }

    async getUserLikesComments(userId) {
        try {
            return await CommentLike.findAll({
                where: { userId },
                attributes: ['commentId']
            });
        } catch(e) {
            throw e;
        }
    }
}

export default new LikeService();