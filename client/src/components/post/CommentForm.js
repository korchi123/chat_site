import { Form, Button, Card } from 'react-bootstrap';

export const CommentForm = ({ 
  onSubmit, 
  value, 
  onChange, 
  isLoading 
}) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Оставить комментарий</Card.Title>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Напишите ваш комментарий..."
              value={value}
              onChange={onChange}
              required
            />
          </Form.Group>
          <div className="d-flex justify-content-center">
            <Button 
              variant="primary" 
              type="submit"
              disabled={isLoading || !value.trim()}
            >
              {isLoading ? 'Отправка...' : 'Отправить'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};