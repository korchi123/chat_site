import { makeAutoObservable, action, runInAction } from 'mobx';
import { $authHost } from '../http';

export default class LikeStore {
  constructor() {
    this._postLikes = [];
    this._commentLikes=[]
    makeAutoObservable(this);
  }

  get postLikes() {
    return this._postLikes;
  }

  get commentLikes() {
        return this._commentLikes;
    }

  // Явно помечаем как action
  setPostLikes = action((postLikes) => {
    this._postLikes = postLikes;
  });

  setCommentLikes = action((commentLikes) => {
    this._commentLikes = commentLikes;
  });

  async fetchUserLikes() {
    try {
      const response = await $authHost.get('/likes/posts/my');
      // Используем runInAction для асинхронного изменения
      runInAction(() => {
        //this._postLikes = response.data;
        this.setPostLikes(response.data)
      });
    } catch (e) {
      console.error('Ошибка при загрузке лайков:', e);
    }
  }

  async likePost(postId) {
    try {
      const numericPostId = Number(postId);
      const response = await $authHost.post(`/likes/posts/${numericPostId}/likes`);
      await this.fetchUserLikes();
      return response.data.likesCount;
    } catch (e) {
      console.error('Ошибка при добавлении лайка:', e);
      throw e;
    }
  }

  async unlikePost(postId) {
    try {
      const response = await $authHost.delete(`/likes/posts/${postId}/likes`);
      await this.fetchUserLikes();
      return response.data.likesCount;
    } catch (e) {
      console.error('Ошибка при удалении лайка:', e);
      throw e;
    }
  }

  isPostLiked(postId) {
    return this._postLikes.some(like => like.postId === postId);
  }



    // ... методы для постов ...

    // Методы для комментариев
    async fetchUserLikesComment() {
        try {
            const response = await $authHost.get('/likes/comments/my');
            runInAction(() => {
                this.setCommentLikes(response.data);
            });
        } catch (e) {
            console.error('Ошибка при загрузке лайков комментариев:', e);
        }
    }

    async likeComment(commentId) {
        try {
            const response = await $authHost.post(`/likes/comments/${commentId}/likes`);
            await this.fetchUserLikesComment();
            return response.data.likesCount;
        } catch (e) {
            console.error('Ошибка при добавлении лайка:', e);
            throw e;
        }
    }

    async unlikeComment(commentId) {
        try {
            const response = await $authHost.delete(`/likes/comments/${commentId}/likes`);
            await this.fetchUserLikesComment();
            return response.data.likesCount;
        } catch (e) {
            console.error('Ошибка при удалении лайка:', e);
            throw e;
        }
    }

    isCommentLiked(commentId) {
        return this._commentLikes.some(like => like.commentId === commentId);
    }

    
}
