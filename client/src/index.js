
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createContext } from 'react';
import AuthStore from './store/AuthStore';
import PostStore from './store/PostStore';
import CommentStore from './store/CommentStore';
import LikeStore from './store/LikeStore';
import SearchStore from './store/searchStore';
import ProfileStore from './store/ProfileStore';

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <Context.Provider value={{
    authStore:new AuthStore(),
    postStore:new PostStore(),
    commentStore:new CommentStore(),
    likeStore:new LikeStore(),
    searchStore: new SearchStore(),
    profileStore: new ProfileStore()
  }}>
 <App />
  </Context.Provider>
  
);


