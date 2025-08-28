import { observer } from 'mobx-react-lite';
import { useContext, useState, useEffect } from 'react';
import { Context } from '../index';
import { Card, Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Post_Route, Login_Route, UserProfile_Route } from '../utils/consts';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import { usePagination } from '../hooks/usePagination';
import { PaginationControls } from '../components/PaginationControls';
import base_photo from '../images/base_photo.jpg'

const Posts = observer(() => {
  const { postStore, authStore, likeStore, searchStore, profileStore } = useContext(Context);
  const navigate = useNavigate();
  const [loadingLikes, setLoadingLikes] = useState({});
  const { 
    page, 
    totalPages, 
    handlePageChange, 
    setTotalCount 
  } = usePagination();

  // Все хуки должны быть в начале компонента, до любых условных операторов

  // Загрузка постов при изменении страницы или поискового запроса
  useEffect(() => {
    const loadPosts = async () => {
        try {
            if (searchStore.searchQuery) {
                await postStore.searchPosts(searchStore.searchQuery);
            } else {
                await postStore.fetchAllPosts(page);
                setTotalCount(postStore.totalCount);
            }
        } catch (e) {
            console.error('Ошибка загрузки постов:', e);
        }
    };
    
    loadPosts();
}, [page, postStore, setTotalCount, searchStore.searchQuery]);
  // Загрузка лайков при авторизации
  useEffect(() => {
    if (authStore.isAuth) {
      likeStore.fetchUserLikes();
    }
  }, [authStore.isAuth, likeStore]);

  const handleLike = async (postId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authStore.isAuth) {
      navigate(Login_Route);
      return;
    }

    setLoadingLikes(prev => ({ ...prev, [postId]: true }));
    
    try {
      let newLikesCount;
      if (likeStore.isPostLiked(postId)) {
        newLikesCount = await likeStore.unlikePost(postId);
      } else {
        newLikesCount = await likeStore.likePost(postId);
      }
      
      postStore.updatePostLikes(postId, newLikesCount);
    } catch (e) {
      console.error('Ошибка при обработке лайка:', e);
    } finally {
      setLoadingLikes(prev => ({ ...prev, [postId]: false }));
    }
  };
  const handleProfileClick = (userId, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`${UserProfile_Route}/${userId}`);
  };
  // Условный рендеринг должен быть после всех хуков
  if (postStore.loading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!postStore.posts || postStore.posts.length === 0) {
    return (
      <Container className="mt-4">
        <Card>
          <Card.Body>
            <Card.Text className="text-center">
              {searchStore.searchQuery 
                ? `По запросу "${searchStore.searchQuery}" ничего не найдено`
                : 'Посты не найдены'}
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      {searchStore.searchQuery && (
        <h2>Результаты поиска: "{searchStore.searchQuery}"</h2>
      )}
      <Row className="mt-3">
        {postStore.posts.map(post => {
          const isLiked = authStore.isAuth && 
            likeStore.postLikes.some(like => like.postId === post.id);
          const isLoading = loadingLikes[post.id];
          const userPhoto = post.User.Profile?.photo;
          return (
            <Col md={6} lg={12} className="mb-4" key={post.id}>
              <Card>
                <Card.Body>
                  <Card.Title>{post.topic}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted d-flex align-items-center">
                      <img
                        src={userPhoto ? profileStore.getProxiedImageUrl(userPhoto) : base_photo}
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
                        onClick={(e) => handleProfileClick(post.User.id, e)}
                      >
                        {post.User?.nickname}
                      </Button>
                    </Card.Subtitle>
                  <Card.Text>{post.content}</Card.Text>
                  <Card.Footer className="mb-2 d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {new Date(post.createdAt).toLocaleString()}
                    </small>
                  </Card.Footer>
                  <div className="d-flex justify-content">
                    <div className="d-flex align-items-center">
                      <Button 
                        variant="link" 
                        onClick={(e) => handleLike(post.id, e)}
                        disabled={isLoading}
                        className="p-0 me-1"
                      >
                        {isLiked ? (
                          <HeartFill color="#ff6b6b" size={20} />
                        ) : (
                          <Heart color="#6c757d" size={20} />
                        )}
                      </Button>
                      <span>{post.likesCount || 0}</span>
                    </div>
                    <div className="flex-grow-1 text-center">
                      <Button 
                        variant="primary" 
                        onClick={() => navigate(`${Post_Route}/${post.id}`)}
                      >
                        Комментарии
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
      
      {totalPages > 1 && !searchStore.searchQuery && (
        <PaginationControls 
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Container>
  );
});

export default Posts;