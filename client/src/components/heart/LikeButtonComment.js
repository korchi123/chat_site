import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import { Context } from '../../index';
import { Button } from 'react-bootstrap';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Login_Route } from '../../utils/consts';

const LikeButtonComment = observer(({ commentId, likesCount }) => {
    const { authStore, likeStore, commentStore } = useContext(Context);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleLike = async () => {
        if (!authStore.isAuth) {
            navigate(Login_Route);
            toast.info('Для лайка необходимо авторизоваться');
            return;
        }
        
        setIsLoading(true);
        try {
            if (likeStore.isCommentLiked(commentId)) {
                const newLikesCount = await likeStore.unlikeComment(commentId);
                commentStore.updateCommentLikes(commentId, newLikesCount);
                toast.success('Лайк удалён');
            } else {
                const newLikesCount = await likeStore.likeComment(commentId);
                commentStore.updateCommentLikes(commentId, newLikesCount);
                toast.success('Лайк добавлен');
            }
        } catch (e) {
            console.error('Ошибка:', e);
            const errorMessage = e.response?.data?.message || 
                               e.message || 
                               'Ошибка при обработке лайка';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const isLiked = authStore.isAuth && likeStore.isCommentLiked(commentId);

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

export default LikeButtonComment;