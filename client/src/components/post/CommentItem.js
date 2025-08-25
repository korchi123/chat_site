import { Button } from 'react-bootstrap';

export const CommentItem = ({ 
  comment, 
  isAuthor, 
  onDelete, 
  isDeleting 
}) => {
  return (
    <div className="mb-3 pb-3 border-bottom position-relative">
      <div className="d-flex justify-content-between">
        <strong>{comment.User?.nickname || 'Аноним'}</strong>
        <small className="text-muted">
          {new Date(comment.createdAt).toLocaleString()}
        </small>
      </div>
      <p className="mb-0 mt-1">{comment.content}</p>
      
      {isAuthor && (
        <Button 
          variant="outline-danger"
          size="sm"
          className="position-absolute end-0 bottom-0 mb-2 me-2"
          onClick={() => onDelete(comment.id)}
          disabled={isDeleting}
        >
          Удалить
        </Button>
      )}
    </div>
  );
};