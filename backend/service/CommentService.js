import ApiError from "../error/ApiError.js";
import { models } from "../config/db.js";

const { Comment, User, Profile } = models;

class CommentService{
    async create({ content, userId, postId }) {
        const comment = await Comment.create({
            content,
            userId,
            postId
        });

        return await Comment.findByPk(comment.id, {
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
                include: [{
                    model: Profile,
                    attributes: ['photo'] // Добавляем только нужные поля из профиля
                }]
            }]
        });
    }
    async delete(commentId, userId) {
        const comment = await Comment.findByPk(commentId);
        
        if (!comment) {
            throw ApiError.NotFound('Комментарий не найден');
        }

        // Проверяем права (либо автор комментария, либо админ)
        if (comment.userId !== userId && !req.user.isAdmin) {
            throw ApiError.Forbidden('Нет прав для удаления комментария');
        }

        await comment.destroy();
    }
    async getByPostId(postId) {
        return await Comment.findAll({
            where: { postId },
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
                include: [{
                    model: Profile,
                    attributes: ['photo'] // Добавляем только нужные поля из профиля
                }]
            }],
            order: [['createdAt', 'ASC']]
        });
    }

    
}
export default new CommentService()