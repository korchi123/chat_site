import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react';
import { Context } from '../index';
import { Card, Container, Row, Col, Button, Modal, Spinner } from 'react-bootstrap';
import { usePagination } from '../hooks/usePagination';
import { PaginationControls } from '../components/PaginationControls';

const MyPosts = observer(() => {
  const { postStore } = useContext(Context);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  
  const { 
    page, 
    totalPages, 
    handlePageChange, 
    setTotalCount 
  } = usePagination();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        await postStore.fetchMyPosts(page);
        setTotalCount(postStore.totalCount);
      } catch (e) {
        console.error('Ошибка загрузки постов:', e);
      }
    };
    
    loadPosts();
  }, [page, postStore, setTotalCount]);

  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await postStore.deletePost(Number(postToDelete));
      alert('Пост успешно удален');
      setShowDeleteModal(false);
      setPostToDelete(null);
    } catch (error) {
      alert('Ошибка при удалении поста');
      console.error('Delete error:', error);
    }
  };

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
              У вас пока нет постов
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Row className="mt-3">
          {postStore.posts.map(post => (
            <Col md={6} lg={12} className="mb-4" key={post.id}>
              <Card>
                <Card.Body>
                  <Card.Title>{post.topic}</Card.Title>
                  <Card.Text>{post.content}</Card.Text>
                  <Card.Footer className='mb-3'>
                    <small className="text-muted">
                      {new Date(post.createdAt).toLocaleString()}
                    </small>
                  </Card.Footer>
                  <Button 
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteClick(post.id)}
                    disabled={postStore.loading}
                  >
                    Удалить
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {totalPages > 1 && (
          <PaginationControls 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </Container>

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
          Вы уверены, что хотите удалить свой пост? Это действие нельзя отменить.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Отмена
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={postStore.loading}
          >
            Удалить пост
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});

export default MyPosts;