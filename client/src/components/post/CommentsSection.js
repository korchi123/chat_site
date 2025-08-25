import { useState } from 'react';
import { Card, Alert, Spinner, Button } from 'react-bootstrap';
import { CommentItem } from './CommentItem';

export const CommentsSection = ({ 
  comments, 
  loading, 
  error, 
  isCommentAuthor,
  onDeleteComment,
  isDeleting
}) => {
  const [visibleCount, setVisibleCount] = useState(3);
  
  const sortedComments = [...comments].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  
  const visibleComments = sortedComments.slice(0, visibleCount);
  
  const loadMore = () => setVisibleCount(prev => prev + 3);

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>Комментарии</Card.Title>
        
        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

        {loading && comments.length === 0 ? (
          <div className="text-center">
            <Spinner animation="border" variant="secondary" />
          </div>
        ) : visibleComments.length > 0 ? (
          visibleComments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isAuthor={isCommentAuthor(comment)}
              onDelete={onDeleteComment}
              isDeleting={isDeleting}
            />
          ))
        ) : (
          <Alert variant="info">Пока нет комментариев</Alert>
        )}

        {sortedComments.length > visibleCount && (
          <div className="text-center mt-3">
            <Button variant="outline-primary" onClick={loadMore}>
              Показать еще комментарии
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};