import PostService from "../service/PostService.js";
import ApiError from "../error/ApiError.js";
import { Op } from 'sequelize';

class PostController {
    async create(req, res, next) {
        try {
            const { topic } = req.body;
            if (!req.user || !req.user.id) {
                throw ApiError.UnauthorizedError();
            }
            const { content } = req.body;
            if (!topic?.trim() || !content?.trim()) {
            throw ApiError.BadRequest('Тема и содержание обязательны');
        }
            
            const userId = req.user.id;
            const post = await PostService.create(topic,content, userId);
            return res.json(post);
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            if (!req.user || !req.user.id) {
                throw ApiError.UnauthorizedError();
            }
            if (!id || isNaN(Number(id))) {
            return res.status(400).json({ message: 'Неверный ID поста' });
    }
            
            const userId = req.user.id;
            const result = await PostService.deletePost(id, userId);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async getAllMyPosts(req, res, next) {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        
        if (!req.user || !req.user.id) {
            throw ApiError.UnauthorizedError();
        }
        
        const userId = req.user.id;
        
        const result = await PostService.getAllMyPosts(limit, page, userId);
        
        return res.json({
            success: true,
            posts: result.posts,
            count: result.count,
            totalPages: Math.ceil(result.count / limit),
            currentPage: page
        });
    } catch (e) {
        next(e);
    }
}

async getAllPosts(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    
    const posts = await PostService.getAllPosts(limit, page);
    
    return res.json({
      posts: posts.rows,  // Изменено с data на posts
      count: posts.count,
      totalPages: Math.ceil(posts.count / limit),
      currentPage: page
    });
  } catch (e) {
    next(e);
  }
}

    async getOne(req, res, next) {
    try {
        const { id } = req.params;
        
        // Улучшенная проверка
        if (!id || isNaN(parseInt(id))) {
            return next(ApiError.BadRequest('Неверный ID поста'));
        }
        
        const post = await PostService.getOne(parseInt(id));
        
        if (!post) {
            return next(ApiError.NotFound('Пост не найден'));
        }
        
        return res.json(post);
    } catch (e) {
        next(e);
    }
}

    async searchPosts(req, res, next) {
    try {
        const { search } = req.query;
        
        if (!search || search.trim() === '') {
            return res.json([]);
        }

        // Добавьте логирование для отладки
        console.log('Search query:', search);
        
        const posts = await PostService.searchPosts(search);
        
        return res.json(posts);
    } catch(e) {
        console.error('Search error:', e);
        next(ApiError.BadRequest('Ошибка при поиске постов'));
    }
}
}
export default new PostController();