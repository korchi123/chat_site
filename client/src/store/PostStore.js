// stores/PostStore.js
import { makeAutoObservable, action } from 'mobx';
import { $host,$authHost } from '../http';

export default class PostStore {
  constructor() {
    this._posts = [];
    this._loading = false;
    this._currentPost=null
    this._totalCount = 0;
    makeAutoObservable(this);
  }

  setPosts(posts) {
    this._posts = posts;
  }

  get posts() {
    return this._posts;
  }
  setLoading(loading) {
    this._loading = loading;
  }

  get loading() {
    return this._loading;
  }
  setCurrentPost(currentPost){
    this._currentPost=currentPost
  }

  get currentPost() {
  return this._currentPost;
}


  setTotalCount(count) {
    this._totalCount = count;
  }

get totalCount() {
    return this._totalCount;
  }
  

  

async fetchAllPosts(page=1, limit=10) {
  try {
    this.setLoading(true);
    const response = await $host.get('/posts/allposts', {
      params: { page, limit }
    });
    
    // Используем response.data.posts вместо response.data.rows
    this.setPosts(response.data.posts || []); 
    this.setTotalCount(response.data.count || 0);
  } catch (e) {
    console.error('Ошибка при загрузке постов:', e);
    this.setPosts([]);
  } finally {
    this.setLoading(false);
  }
}
  async fetchMyPosts(page = 1, limit = 10) {
    try {
        this.setLoading(true);
        const response = await $authHost.get('/posts/getallmyposts', {
            params: { page, limit }
        });
        
        // Обрабатываем новую структуру ответа
        this.setPosts(response.data.posts || []);
        this.setTotalCount(response.data.count || 0);
    } catch (e) {
        console.error('Ошибка при загрузке постов:', e);
        this.setPosts([]);
        this.setTotalCount(0);
    } finally {
        this.setLoading(false);
    }
}
  async createPost(topic, content){
    try{
        const response = await $authHost.post('/posts/create',{topic, content});
        return response.data;

    }catch(e){

    }
  }
  async deletePost(postId){
    try{
        this.setLoading(true);
        const response = await $authHost.delete(`/posts/delete/${postId}`);
        this.setPosts(this._posts.filter(post => post.id !== postId));

        return response.data;

    }catch(e){

    } finally {
      this.setLoading(false);
    }
  }
  async fetchPostById(id) {
    try {
      
        this.setLoading(true);
        this.setCurrentPost(null);
    

      const response = await $host.get(`/posts/${id}`);
      
    
        this.setCurrentPost(response.data);
      
    } catch (e) {
      console.error('Ошибка при загрузке поста:', e);
      throw e;
    } finally {
      
        this.setLoading(false);
      
    }
  }
  async searchPosts(searchQuery = '') {
    try {
        this.setLoading(true);
        const response = await $host.get('/posts/search', {
            params: { search: searchQuery }
        });
        this.setPosts(response.data);
        this.setTotalCount(response.data.length);
    } catch (e) {
        console.error('Ошибка при поиске постов:', e);
        this.setPosts([]);
        this.setTotalCount(0);
        throw e; // Пробрасываем ошибку для обработки в компоненте
    } finally {
        this.setLoading(false);
    }
}
  updatePostLikes = action((postId, likesCount) => {
  if (this._currentPost && this._currentPost.id === postId) {
    this._currentPost.likesCount = likesCount;
  }
  const post = this._posts.find(p => p.id === postId);
  if (post) {
    post.likesCount = likesCount;
  }
});


}