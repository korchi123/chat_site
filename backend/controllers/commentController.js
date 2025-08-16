import ApiError from "../error/ApiError.js";
import CommentService from "../service/CommentService.js";


class commentController{
    async createComment(req,res,next){
     try{
            const { content} = req.body;
            const {postId}=req.params;
            const userId = req.user.id;

            if (!content?.trim()) {
                throw ApiError.BadRequest('Текст комментария обязателен');
            }

            if (!postId || isNaN(Number(postId))) {
                throw ApiError.BadRequest('Неверный ID поста');
            }
            
            const comment = await CommentService.create({
                content,
                userId,
                postId: Number(postId)
            });
            return res.json(comment);
     }  catch(e){
            next(e)
     }

    }
    async deleteComment(req,res,next){
    try {
            const { id } = req.params;
            const userId = req.user.id;

            if (!id || isNaN(Number(id))) {
                throw ApiError.BadRequest('Неверный ID комментария');
            }

            await CommentService.delete(Number(id), userId);
            return res.json({ success: true });
        } catch (e) {
            next(e);
        } 

    }
    async getForPost(req, res, next) {
        try {
            const { postId } = req.params;
            
            if (!postId || isNaN(Number(postId))) {
                throw ApiError.BadRequest('Неверный ID поста');
            }

            const comments = await CommentService.getByPostId(Number(postId));
            return res.json(comments);
        } catch (e) {
            next(e);
        }
    }

}
export default new commentController()
