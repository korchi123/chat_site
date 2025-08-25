import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import { Context } from '../../index';
import { Button } from 'react-bootstrap';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Login_Route } from '../../utils/consts';

const LikeButtonPost = observer(({ postId, likesCount }) => {
  const { authStore, likeStore, postStore } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLike = async (e) => {
    e.preventDefault(); // Предотвращаем поведение по умолчанию
    e.stopPropagation(); // Останавливаем всплытие события
    
    if (!authStore.isAuth) {
      navigate(Login_Route);
      toast.info('Для лайка необходимо авторизоваться');
      return;
    }
    
    setIsLoading(true);
    try {
      if (likeStore.isPostLiked(postId)) {
        const newLikesCount = await likeStore.unlikePost(postId);
        postStore.updatePostLikes(postId, newLikesCount);
        toast.success('Лайк удалён');
      } else {
        const newLikesCount = await likeStore.likePost(postId);
        postStore.updatePostLikes(postId, newLikesCount);
        toast.success('Лайк добавлен');
      }
    } catch (e) {
      console.error('Ошибка:', e);
      toast.error(e.response?.data?.message || 'Ошибка при обработке лайка');
    } finally {
      setIsLoading(false);
    }
  };

  const isLiked = authStore.isAuth && likeStore.isPostLiked(postId);

  return (
    <div className="d-flex align-items-center gap-2">
      <Button 
        variant="link" 
        onClick={handleLike}
        disabled={isLoading}
        className="p-0"
        aria-label={isLiked ? 'Удалить лайк' : 'Поставить лайк'}
      >
        {isLiked ? (
          <HeartFill color="#ff6b6b" size={18} />
        ) : (
          <Heart color="#6c757d" size={18} />
        )}
      </Button>
      <span className="text-muted fs-7">
        {likesCount || 0}
      </span>
    </div>
  );
});

export default LikeButtonPost;