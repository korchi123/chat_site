import { Modal, Button } from 'react-bootstrap';

export const DeleteCommentModal = ({ 
  show, 
  onHide, 
  onConfirm, 
  isLoading 
}) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Подтверждение удаления</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Вы уверены, что хотите удалить свой комментарий? Это действие нельзя отменить.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Отмена
        </Button>
        <Button 
          variant="danger" 
          onClick={onConfirm}
          disabled={isLoading}
        >
          Удалить комментарий
        </Button>
      </Modal.Footer>
    </Modal>
  );
};