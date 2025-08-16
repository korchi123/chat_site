//import { Op } from 'sequelize';
import ApiError from "../error/ApiError.js";
import { models } from '../config/db.js';

import { Op } from 'sequelize';


const { Post, User, Profile } = models;


class PostService {
    async create(topic, content, userId) {
        if (!content || content.trim().length === 0) {
            throw ApiError.BadRequest('Содержание поста не может быть пустым');
        }
        const user = await User.findByPk(userId);
        if (!user.isActivated) {
            throw ApiError.Forbidden('Для создания поста необходимо активировать аккаунт');
        }
        const post = await Post.create({ 
            topic,
            content, 
            userId 
        });
        
        return post;
    };
    async deletePost(Id, userId) {
        // Находим пост
        const postId = Number(Id);
        if (isNaN(postId)) {
        throw new Error('Неверный ID поста');
  }

        const post = await Post.findByPk(postId);
        if (!post) {
            throw ApiError.BadRequest('Пост не найден');
        }

        // Проверяем права доступа
        if (post.userId !== userId) {
            throw ApiError.Forbidden('Вы можете удалять только свои посты');
        }

        // Удаляем пост
        await post.destroy();
        
        return { message: 'Пост успешно удален' };
    }
async getAllMyPosts(limit = 10, page = 1, userId) {
    try {
        const offset = (page - 1) * limit;
        
        // Получаем посты и общее количество
        const { count, rows: posts } = await Post.findAndCountAll({
            where: { userId },
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
                include: [{
                    model: Profile,
                    attributes: ['photo']
                }]
            }],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        return {
            posts: posts,
            count: count
        };
    } catch (error) {
        console.error('Error in getAllMyPosts:', error);
        throw ApiError.BadRequest('Ошибка при получении постов');
    }
}

async getAllPosts(limit = 10, page = 1) {
  try {
    const offset = (page - 1) * limit;
    
    const { rows, count } = await Post.findAndCountAll({
      include: [
        {
          model: User,
          attributes: ['id', 'nickname'],
          include: [{
            model: Profile,
            attributes: ['photo'] // Добавляем только нужные поля из профиля
          }]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    return { rows, count };
  } catch (e) {
    console.error('Error in getAllPosts:', e);
    throw ApiError.BadRequest('Ошибка при получении постов');
  }
  }
async getOne(postId) {
    const id = Number(postId);
    
    // Дополнительная проверка
    if (isNaN(id) || id <= 0) {
        throw ApiError.BadRequest('Неверный ID поста');
    }
    
    const post = await Post.findByPk(id, {
        include: [{
            model: User,
            attributes: ['id', 'nickname'],
            include: [{
                model: Profile,
                attributes: ['photo'] // Добавляем только нужные поля из профиля
            }]
        }]
    });
    
    if (!post) {
        throw ApiError.NotFound('Пост не найден');
    }
    
    return post;
}

    async searchPosts(searchQuery) {
    try {
        console.log('Searching for:', searchQuery); // Логирование
        
        return await Post.findAll({ 
            where: {
                [Op.or]: [
                    { topic: { [Op.iLike]: `%${searchQuery}%` } },
                    { content: { [Op.iLike]: `%${searchQuery}%` } }
                ]
            },
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
                include: [{
                    model: Profile,
                    attributes: ['photo'] // Добавляем только нужные поля из профиля
            }]
            }],
            order: [['createdAt', 'DESC']]
        });
    } catch(e) {
        console.error('Error in searchPosts:', e);
        throw ApiError.BadRequest('Ошибка при поиске постов');
    }
}

}
export default new PostService