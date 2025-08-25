// stores/CommentStore.js
import { makeAutoObservable, action } from 'mobx';
import { $host, $authHost } from '../http';

export default class CommentStore {
    constructor() {
        this._comments = [];
        this._loading = false;
        this._error = null;
        makeAutoObservable(this);
    }

    setComments(comments) {
        this._comments = comments;
    }

    setLoading(loading) {
        this._loading = loading;
    }

    setError(error) {
        this._error = error;
    }

    get comments() {
        return this._comments;
    }

    get loading() {
        return this._loading;
    }

    get error() {
        return this._error;
    }

    async fetchCommentsByPostId(postId) {
        try {
            this.setLoading(true);
            this.setError(null);
            const response = await $host.get(`/comments/post/${postId}`);
            this.setComments(response.data);
        } catch (e) {
            this.setError('Ошибка при загрузке комментариев');
            console.error('Ошибка при загрузке комментариев:', e);
        } finally {
            this.setLoading(false);
        }
    }

    async createComment(postId, content) {
        try {
            this.setLoading(true);
            this.setError(null);
            const response = await $authHost.post(`/comments/post/${postId}`, {
                content,
               
            });
            
            // Добавляем новый комментарий в начало списка
            this.setComments([response.data, ...this._comments]);
            return response.data;
        } catch (e) {
            if (e.response?.status === 401) {
            this.setError('Для добавления комментария необходимо авторизоваться');
        } else {
            this.setError(e.response?.data?.message || 'Ошибка при создании комментария');
        }
        console.error('Ошибка при создании комментария:', e);
        throw e;
        } finally {
            this.setLoading(false);
        }
    }

    async deleteComment(commentId) {
        try {
            this.setLoading(true);
            this.setError(null);
            await $authHost.delete(`/comments/${commentId}`);
            this.setComments(this._comments.filter(comment => comment.id !== commentId));
        } catch (e) {
            this.setError('Ошибка при удалении комментария');
            console.error('Ошибка при удалении комментария:', e);
            throw e;
        } finally {
            this.setLoading(false);
        }
    }
    updateCommentLikes = action((commentId, likesCount) => {
    const comment = this._comments.find(c => c.id === commentId);
    if (comment) {
        comment.likesCount = likesCount;
    }
});
}