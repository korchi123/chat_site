import { observer } from 'mobx-react-lite';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Context } from '../index';
import { Card, Container, Spinner, Alert, Button, Form, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import LikeButtonPost from '../components/heart/LikeButtonPost';
import LikeButtonComment from '../components/heart/LikeButtonComment';
import base_photo from '../images/base_photo.jpg';
import { useNavigate } from 'react-router-dom';
import { UserProfile_Route } from '../utils/consts';

const SinglePost = observer(() => {
  const { postStore, commentStore, authStore,likeStore,profileStore } = useContext(Context);
  const { id } = useParams();
  const [commentText, setCommentText] = useState('');
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(3);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate=useNavigate()

  const loadData = useCallback(async () => {
    try {
      
      if (authStore.isAuth) {
        await likeStore.fetchUserLikes();
        await likeStore.fetchUserLikesComment();
      }
    } catch (e) {
      console.error('Ошибка загрузки данных:', e);
    }
  }, [authStore.isAuth, likeStore]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  useEffect(() => {
    if (!id || isNaN(Number(id))) return;

    postStore.fetchPostById(Number(id));
    commentStore.fetchCommentsByPostId(Number(id));

    return () => {
      postStore.setCurrentPost(null);
      commentStore.setComments([]);
      //setVisibleCommentsCount(3);
    };
  }, [id, postStore, commentStore]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const currentUser = {
      id: authStore.user.id,
      nickname: authStore.user.nickname,
      Profile: {
        photo: profileStore.photo
      }
    }
      await commentStore.createComment(Number(id), commentText, currentUser);
      setCommentText('');
      //setVisibleCommentsCount(3);
    } catch (e) {
      // Ошибка уже обработана в сторе
    }
  };

  const handleDeleteClick = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await commentStore.deleteComment(Number(commentToDelete));
      alert('Комментарий успешно удален');
      setShowDeleteModal(false);
      setCommentToDelete(null);
    } catch (error) {
      alert('Ошибка при удалении комментария');
      console.error('Delete error:', error);
    }
  };

  // Сортируем комментарии по дате (новые сначала)
  const sortedComments = [...commentStore.comments].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Берем только необходимое количество комментариев
  const visibleComments = sortedComments.slice(0, visibleCommentsCount);

  const loadMoreComments = () => {
    setVisibleCommentsCount(prev => prev + 3);
  };

  // Проверяем, является ли текущий пользователь автором комментария
  const isCommentAuthor = (comment) => {
    return comment.userId === authStore.user?.id;
  };

  if (postStore.loading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!postStore.currentPost) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">Пост не найден или не загружен</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Карточка поста */}
      <Card className="mb-4">
    <Card.Body>
      <Card.Title>{postStore.currentPost.topic}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted d-flex align-items-center">
        <img
          src={post.User.Profile?.photo ? profileStore.getProxiedImageUrl(post.User.Profile.photo) : base_photo}
          alt="Аватар"
          width={25}
          height={25}
          style={{
            borderRadius: '50%',
            objectFit: 'cover',
            marginRight: '8px',
            border: '1px solid #ddd'
          }}
          onError={(e) => {
            e.target.src = base_photo;
          }}
        />
        Автор: {' '}
        <Button 
          variant="link" 
          className="p-0 text-decoration-none"
          onClick={() => navigate(`${UserProfile_Route}/${postStore.currentPost.User.id}`)}
        >
          {postStore.currentPost.User?.nickname}
        </Button>
      </Card.Subtitle>
      <Card.Text>{postStore.currentPost.content}</Card.Text>
      <Card.Footer className="mb-2 d-flex justify-content-between align-items-center">
        <small className="text-muted">
          {new Date(postStore.currentPost.createdAt).toLocaleString()}
        </small>
      </Card.Footer>
      <div className="d-flex justify-content">
        <div className="d-flex align-items-center">
          <LikeButtonPost 
            postId={postStore.currentPost.id} 
            likesCount={postStore.currentPost.likesCount}
          />
        </div>
      </div>
    </Card.Body>
  </Card>
      
      
      {/* Секция комментариев */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Комментарии</Card.Title>
          
          {commentStore.error && (
            <Alert variant="danger" className="mb-3">{commentStore.error}</Alert>
          )}

          {commentStore.loading && commentStore.comments.length === 0 ? (
            <div className="text-center">
              <Spinner animation="border" variant="secondary" />
            </div>
          ) : visibleComments.length > 0 ? (
            visibleComments.map(comment => (
              <div key={comment.id} className="mb-3 pb-3 border-bottom position-relative">
                <div className="d-flex align-items-center">
                  <img
                    src={comment.User.Profile?.photo ? profileStore.getProxiedImageUrl(comment.User.Profile.photo) : base_photo}
                    alt="Аватар"
                    width={25}
                    height={25}
                    style={{
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginRight: '8px',
                      border: '1px solid #ddd'
                    }}
                    onError={(e) => {
                      e.target.src = base_photo;
                    }}
                  />
                  <div className="d-flex justify-content-between w-100">
                    <Button 
                      variant="link" 
                      className="p-0 text-decoration-none"
                      onClick={() => navigate(`${UserProfile_Route}/${comment.User.id}`)}
                    >
                      {comment.User?.nickname || 'Аноним'}
                    </Button>
                    
                    <small className="text-muted">
                      {new Date(comment.createdAt).toLocaleString()}
                    </small>
                  </div>
                </div>
                <p className="mb-0 mt-1">{comment.content}</p>
                <LikeButtonComment 
                commentId={comment.id} 
                    likesCount={comment.likesCount} 
                  />
                {/* Кнопка удаления (только для автора комментария) */}
                {isCommentAuthor(comment) && (
                  <Button 
                    variant="outline-danger"
                    size="sm"
                    className="position-absolute end-0 bottom-0 mb-2 me-2"
                    onClick={() => handleDeleteClick(comment.id)}
                    disabled={commentStore.loading}
                  >
                    Удалить
                  </Button>
                )}
              </div>
            ))
          ) : (
            <Alert variant="info">Пока нет комментариев</Alert>
          )}

          {sortedComments.length > visibleCommentsCount && (
            <div className="text-center mt-3">
              <Button 
                variant="outline-primary"
                onClick={loadMoreComments}
              >
                Показать еще комментарии
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Форма добавления комментария */}
      <Card>
        <Card.Body>
          <Card.Title>Оставить комментарий</Card.Title>
          <Form onSubmit={handleSubmitComment}>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Напишите ваш комментарий..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button 
                variant="primary" 
                type="submit"
                disabled={commentStore.loading || !commentText.trim()}
              >
                {commentStore.loading ? 'Отправка...' : 'Отправить'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Модальное окно подтверждения удаления */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Вы уверены, что хотите удалить свой комментарий? Это действие нельзя отменить.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Отмена
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={commentStore.loading}
          >
            Удалить комментарий
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
});

export default SinglePost;