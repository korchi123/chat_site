import { Card } from 'react-bootstrap';

export const PostCard = ({ post }) => {
  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>{post.topic}</Card.Title>
        <Card.Text>{post.content}</Card.Text>
        <Card.Footer className="text-muted">
          <small>
            Опубликовано: {new Date(post.createdAt).toLocaleString()}
          </small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};